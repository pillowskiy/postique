package pg

import (
	"context"
	"fmt"

	sq "github.com/Masterminds/squirrel"
	"github.com/pillowskiy/postique/sso/internal/domain"
)

type SessionStorage struct {
	*Storage
}

func NewSessionStorage(pg *Storage) *SessionStorage {
	return &SessionStorage{Storage: pg}
}

func (s *SessionStorage) AppSession(ctx context.Context, token string, appID domain.ID) (*domain.Session, error) {
	const op = "pg.SessionStorage.AppSession"

	q, args, err := psql.Select("*").From("sessions").
		Where(sq.And{sq.Eq{"app_id": appID}, sq.Eq{"token": token}}).ToSql()
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	session := new(domain.Session)
	if err := s.ext(ctx).QueryRowxContext(ctx, q, args...).StructScan(session); err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return session, nil
}

func (s *SessionStorage) CreateSession(ctx context.Context, session *domain.Session) error {
	const op = "pg.SessionStorage.CreateSession"

	q, args, err := psql.
		Insert("sessions").Columns("id", "app_id", "token", "fingerprint", "valid", "created_at").
		Values(session.ID, session.AppID, session.Token, session.Fingerprint, session.Valid, session.CreatedAt).ToSql()
	if err != nil {
		return fmt.Errorf("%s: %w", op, err)
	}

	if _, err := s.ext(ctx).ExecContext(ctx, q, args...); err != nil {
		return fmt.Errorf("%s: %w", op, err)
	}
	return nil
}

func (s *SessionStorage) SaveSession(ctx context.Context, session *domain.Session) error {
	const op = "pg.SessionStorage.SaveSessions"

	q, args, err := psql.Update("sessions").
		Set("fingerprint", session.Fingerprint).
		Set("valid", session.Valid).
		Where(sq.And{sq.Eq{"app_id": session.AppID}, sq.Eq{"token": session.Token}}).ToSql()
	if err != nil {
		return fmt.Errorf("%s: %w", op, err)
	}

	if _, err := s.ext(ctx).ExecContext(ctx, q, args...); err != nil {
		return fmt.Errorf("%s: %w", op, err)
	}
	return nil
}
