package usecase

import (
	"context"
	"fmt"
	"log/slog"
	"time"

	"github.com/pillowskiy/postique/sso/internal/config"
	"github.com/pillowskiy/postique/sso/internal/dto"
	"github.com/pillowskiy/postique/sso/internal/lib/jwt"
)

const (
	sessionTokenType = "Bearer"
	accessTokenTTL   = time.Minute * 15
)

type sessionUseCase struct {
	cfg config.Session
	log *slog.Logger
}

func NewSessionUseCase(cfg config.Session, log *slog.Logger) *sessionUseCase {
	return &sessionUseCase{cfg: cfg, log: log}
}

func (uc *sessionUseCase) CreateSession(ctx context.Context, payload *dto.UserPayload, secret string) (*dto.Session, error) {
	const op = "usecase.sessionUseCase.CreateSession"
	log := uc.log.With(
		slog.String("op", op),
		slog.Any("payload", payload),
	)

	refreshToken, err := jwt.NewToken(payload.UserID, secret, uc.cfg.TokenTTL)
	if err != nil {
		log.Error("Failed to generate refresh token", slog.String("error", err.Error()))
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	accessToken, err := jwt.NewToken(payload.UserID, uc.cfg.AccessTokenSecret, accessTokenTTL)
	if err != nil {
		log.Error("Failed to generate access token", slog.String("error", err.Error()))
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return &dto.Session{
		Token:       refreshToken,
		TokenType:   "Bearer",
		AccessToken: accessToken,
		ExpiresIn:   accessTokenTTL,
	}, nil
}
