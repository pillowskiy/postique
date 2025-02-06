package pg

import (
	"context"
	"fmt"
	"time"

	sq "github.com/Masterminds/squirrel"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/jmoiron/sqlx"
	"github.com/pillowskiy/postique/sso/internal/config"
	"github.com/pillowskiy/postique/sso/internal/storage"
	"github.com/pkg/errors"
)

var psql = sq.StatementBuilder.PlaceholderFormat(sq.Dollar)

type (
	InTxQueryCall        func(tx *sqlx.Tx) (*sqlx.Rows, error)
	InTxQueryCallContext func(ctx context.Context, tx *sqlx.Tx) (*sqlx.Rows, error)
)

type Ext interface {
	sqlx.ExecerContext
	sqlx.QueryerContext
}

type txKey struct{}

type Storage struct {
	__db *sqlx.DB
}

func MustConnect(cfg config.Postgres) *Storage {
	const op = "pg.NewStorage"
	dataSourceName := fmt.Sprintf(
		"host=%s port=%v user=%s dbname=%s sslmode=%s password=%s",
		cfg.Host, cfg.Port, cfg.User, cfg.Database, cfg.SSL, cfg.Password,
	)

	db, err := sqlx.Connect("pgx", dataSourceName)
	if err != nil {
		panic(fmt.Sprintf("%s: %v", op, err))
	}

	db.SetMaxOpenConns(cfg.MaxOpenConns)
	db.SetMaxIdleConns(cfg.MaxIdleConns)
	db.SetConnMaxLifetime(cfg.Timeout)
	db.SetConnMaxIdleTime(cfg.Timeout)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*15)
	defer cancel()

	if err = db.PingContext(ctx); err != nil {
		panic(fmt.Sprintf("%s: %v", op, err))
	}

	return &Storage{__db: db}
}

func (s *Storage) ext(ctx context.Context) Ext {
	pgExt, ok := ctx.Value(txKey{}).(Ext)
	if !ok {
		return s.__db
	}

	return pgExt
}

func (s *Storage) DoInTransaction(
	ctx context.Context, call storage.InTransactionalCall,
) (err error) {
	if tx := ctx.Value(txKey{}); tx != nil {
		return call(ctx)
	}

	tx, err := s.__db.Beginx()
	if err != nil {
		return err
	}

	defer func() {
		if p := recover(); p != nil {
			_ = tx.Rollback()
			panic(p)
		} else if err != nil {
			xerr := tx.Rollback()
			if xerr != nil {
				err = errors.Wrap(err, xerr.Error())
			}

			fmt.Printf("Catched: %+v", err)
		} else {
			err = tx.Commit()
		}
	}()

	ctx = context.WithValue(ctx, txKey{}, tx)
	err = call(ctx)

	return
}
