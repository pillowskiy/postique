package pg

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/Masterminds/squirrel"
	"github.com/pillowskiy/postique/sso/internal/domain"
	"github.com/pillowskiy/postique/sso/internal/storage"
)

type ProfileStorage struct {
	*Storage
}

func NewProfileStorage(pg *Storage) *ProfileStorage {
	return &ProfileStorage{Storage: pg}
}

func (s *ProfileStorage) CreateProfile(ctx context.Context, profile *domain.UserProfile) error {
	const op = "pg.ProfileStorage.SaveProfile"
	q, args, err := psql.
		Insert("profiles").Columns("user_id", "username", "avatar_path", "bio", "created_at").
		Values(profile.UserID, profile.Username, profile.AvatarPath, profile.Bio, profile.CreatedAt).
		ToSql()
	if err != nil {
		return fmt.Errorf("%s: %w", op, err)
	}

	if _, err := s.ext(ctx).ExecContext(ctx, q, args...); err != nil {
		return fmt.Errorf("%s: %w", op, err)
	}

	return nil
}

func (s *ProfileStorage) SaveProfile(ctx context.Context, userID domain.ID, profile *domain.UserProfile) error {
    const op = "pg.ProfileStorage.SaveProfile"
    q, args, err := psql.
        Update("profiles").
        Set("username", squirrel.Expr("COALESCE(NULLIF(?, ''), username)", profile.Username)).
        Set("avatar_path", squirrel.Expr("COALESCE(NULLIF(?, ''), avatar_path)", profile.AvatarPath)).
        Set("bio", squirrel.Expr("COALESCE(NULLIF(?, ''), bio)", profile.Bio)).
        Where("user_id = ?", userID).
        ToSql()

    if err != nil {
        return fmt.Errorf("%s: %w", op, err)
    }

    if _, err := s.ext(ctx).ExecContext(ctx, q, args...); err != nil {
        return fmt.Errorf("%s: %w", op, err)
    }

    return nil
}

func (s *ProfileStorage) Profile(ctx context.Context, userID domain.ID) (*domain.UserProfile, error) {
	const op = "pg.ProfileStorage.Profile"

	q, args, err := psql.Select("*").From("profiles").Where("user_id = ?", userID).ToSql()
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	profile := new(domain.UserProfile)
	if err := s.ext(ctx).QueryRowxContext(ctx, q, args...).StructScan(profile); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("%s: %w", op, storage.ErrProfileNotFound)
		}
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return profile, nil
}
