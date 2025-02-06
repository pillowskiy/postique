package usecase

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"github.com/pillowskiy/postique/sso/internal/config"
	"github.com/pillowskiy/postique/sso/internal/domain"
	"github.com/pillowskiy/postique/sso/internal/dto"
	"github.com/pillowskiy/postique/sso/internal/lib/jwt"
	"github.com/pillowskiy/postique/sso/internal/storage"
)

var (
	ErrSessionNotFound = errors.New("session not found")
	ErrInvalidSession  = errors.New("invalid session")
)

const (
	sessionTokenType = "Bearer"
	accessTokenTTL   = time.Minute * 15
)

type SessionRepository interface {
	AppSession(ctx context.Context, token string, appID domain.ID) (*domain.Session, error)
	CreateSession(ctx context.Context, session *domain.Session) error
	SaveSession(ctx context.Context, session *domain.Session) error

	storage.Transactional
}

type sessionUseCase struct {
	sessionRepo SessionRepository
	cfg         config.Session
	log         *slog.Logger
}

func NewSessionUseCase(sessionRepo SessionRepository, cfg config.Session, log *slog.Logger) *sessionUseCase {
	return &sessionUseCase{sessionRepo: sessionRepo, cfg: cfg, log: log}
}

func (uc *sessionUseCase) Refresh(ctx context.Context, input *dto.AppSession, secret string) (*dto.Session, error) {
	const op = "usecase.sessionUseCase.Refresh"
	log := uc.log.With(slog.String("op", op), slog.Any("meta", input.AppSessionMeta))

	log.Debug("Refreshing session")

	appSession, err := uc.appSession(ctx, input.Token, input.AppID)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	if !appSession.IsValid() {
		return nil, ErrInvalidSession
	}

	var session *dto.Session
	err = uc.sessionRepo.DoInTransaction(ctx, func(ctx context.Context) error {
		payload, err := uc.getUserPayload(input.Token, secret)
		if err != nil {
			return fmt.Errorf("%s: %w", op, err)
		}

		session, err = uc.Create(ctx, payload, &input.AppSessionMeta, secret)
		if err != nil {
			return fmt.Errorf("%s: %w", op, err)
		}

		appSession.Invalidate()
		if err := uc.sessionRepo.SaveSession(ctx, appSession); err != nil {
			return fmt.Errorf("%s: %w", op, err)
		}

		return nil
	})
	if err != nil {
		log.Error("Failed to refresh session", slog.String("error", err.Error()))
		return nil, err
	}

	return session, nil
}

func (uc *sessionUseCase) Create(ctx context.Context, payload *dto.UserPayload, meta *dto.AppSessionMeta, secret string) (*dto.Session, error) {
	const op = "usecase.sessionUseCase.CreateSession"
	log := uc.log.With(
		slog.String("op", op),
		slog.Any("payload", payload),
	)

	accessToken, err := jwt.New(payload, uc.cfg.AccessTokenSecret, accessTokenTTL)
	if err != nil {
		log.Error("Failed to generate access token", slog.String("error", err.Error()))
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	session, err := uc.createAppSession(ctx, payload, meta, secret)
	if err != nil {
		log.Error("Failed to generate refresh token", slog.String("error", err.Error()))
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return &dto.Session{
		Token:       session.Token,
		TokenType:   "Bearer",
		AccessToken: accessToken,
		ExpiresIn:   accessTokenTTL,
	}, nil
}

func (uc *sessionUseCase) VerifyAccess(ctx context.Context, token string) (*dto.UserPayload, error) {
	return uc.getUserPayload(token, uc.cfg.AccessTokenSecret)
}

func (uc *sessionUseCase) createAppSession(ctx context.Context, payload *dto.UserPayload, meta *dto.AppSessionMeta, secret string) (*domain.Session, error) {
	const op = "usecase.sessionUseCase.CreateAppSession"

	token, err := jwt.New(payload, secret, uc.cfg.TokenTTL)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	session, err := domain.NewSession(token, meta.Fingerprint, meta.AppID)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	if err := uc.sessionRepo.CreateSession(ctx, session); err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return session, nil
}

func (uc *sessionUseCase) appSession(ctx context.Context, token string, appID domain.PID) (*domain.Session, error) {
	const op = "usecase.sessionUseCase.verifyAppSession"

	domainAppID, err := domain.NewID(appID)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	session, err := uc.sessionRepo.AppSession(ctx, token, domainAppID)
	if err != nil {
		if errors.Is(err, storage.ErrSessionNotFound) {
			return nil, ErrSessionNotFound
		}
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return session, nil
}

func (uc *sessionUseCase) getUserPayload(token string, secret string) (*dto.UserPayload, error) {
	const op = "usecase.sessionUseCase.verify"
	log := uc.log.With(slog.String("op", op))

	payload := new(dto.UserPayload)
	if err := jwt.VerifyAndScan(token, secret, payload); err != nil {
		log.Error("Failed to verity and scan token", slog.String("error", err.Error()))
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return payload, nil
}
