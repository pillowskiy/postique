package pg

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	sq "github.com/Masterminds/squirrel"
	"github.com/pillowskiy/postique/sso/internal/domain"
	"github.com/pillowskiy/postique/sso/internal/storage"
)

type UserStorage struct {
	*Storage
}

func NewUserStorage(pg *Storage) *UserStorage {
	return &UserStorage{Storage: pg}
}

func (s *UserStorage) User(ctx context.Context, email domain.Email) (*domain.User, error) {
	const op = "pg.UserStorage.User"
	q, args, err := psql.Select("*").From("users").Where(sq.Eq{"email": email}).ToSql()
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	user := new(domain.User)
	rowx := s.ext(ctx).QueryRowxContext(ctx, q, args...)
	if err := rowx.StructScan(user); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, storage.ErrUserNotFound
		}
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return user, nil
}

func (s *UserStorage) SaveUser(ctx context.Context, user *domain.User) (domain.ID, error) {
	const op = "pg.UserStorage.SaveUser"
	q, args, err := psql.
		Insert("users").Columns("id", "email", "pass_hash").
		Values(user.ID, user.Email, user.Password).
		Suffix(`RETURNING "id"`).ToSql()
	if err != nil {
		return "", fmt.Errorf("%s: %w", op, err)
	}

	var id domain.ID
	if err := s.ext(ctx).QueryRowxContext(ctx, q, args...).Scan(&id); err != nil {
		return "", fmt.Errorf("%s: %w", op, err)
	}

	return id, nil
}
