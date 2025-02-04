package pg

import (
	"context"
	"fmt"

	sq "github.com/Masterminds/squirrel"
	"github.com/pillowskiy/postique/sso/internal/domain"
)

type AppStorage struct {
	pg *Storage
}

func NewAppStorage(pg *Storage) *AppStorage {
	return &AppStorage{pg: pg}
}

func (s *AppStorage) App(ctx context.Context, name domain.Name) (*domain.App, error) {
	const op = "pg.AppStorage.User"
	q, args, err := psql.Select("*").From("apps").Where(sq.Eq{"name": name}).ToSql()
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	app := new(domain.App)
	if err := s.pg.Ext(ctx).QueryRowxContext(ctx, q, args...).StructScan(app); err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return app, nil
}

func (s *AppStorage) SaveApp(ctx context.Context, app *domain.App) (domain.ID, error) {
	const op = "pg.AppStorage.SaveApp"
	q, args, err := psql.
		Insert("apps").Columns("id", "secret", "name").
		Values(app.ID, app.Secret, app.Name).
		Suffix("RETURNING \"id\"").ToSql()
	if err != nil {
		return domain.EmptyID, fmt.Errorf("%s: %w", op, err)
	}

	var id domain.ID
	if err := s.pg.Ext(ctx).QueryRowxContext(ctx, q, args...).Scan(&id); err != nil {
		return domain.EmptyID, fmt.Errorf("%s: %w", op, err)
	}

	return id, nil
}
