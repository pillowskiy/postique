package usecase

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	"github.com/pillowskiy/postique/sso/internal/config"
	"github.com/pillowskiy/postique/sso/internal/domain"
	"github.com/pillowskiy/postique/sso/internal/dto"
	"github.com/pillowskiy/postique/sso/internal/storage"
)

var (
	ErrAppAlreadyExists = errors.New("app already exists")
	ErrAppNotFound      = errors.New("app not found")
)

type AppRepository interface {
	App(ctx context.Context, name domain.Name) (*domain.App, error)
	SaveApp(ctx context.Context, app *domain.App) (domain.ID, error)
}

type AppSessionUseCase interface {
	Create(ctx context.Context, payload *dto.UserPayload, meta *dto.AppSessionMeta, secret string) (*dto.Session, error)
	Refresh(ctx context.Context, appSession *dto.AppSession, secret string) (*dto.Session, error)
	VerifyAccess(ctx context.Context, token string) (*dto.UserPayload, error)
}

type appUseCase struct {
	appRepo   AppRepository
	sessionUC AppSessionUseCase
	cfg       config.Session
	log       *slog.Logger
}

func NewAppUseCase(appRepo AppRepository, sessionUC AppSessionUseCase, cfg config.Session, log *slog.Logger) *appUseCase {
	return &appUseCase{appRepo: appRepo, sessionUC: sessionUC, cfg: cfg, log: log}
}

func (uc *appUseCase) VerifyAccess(ctx context.Context, token string) (*dto.UserPayload, error) {
	return uc.sessionUC.VerifyAccess(ctx, token)
}

func (uc *appUseCase) RefreshSession(ctx context.Context, token string, fingerprint *string, appName string) (*dto.Session, error) {
	const op = "usecase.appUseCase.RefreshSession"
	log := uc.log.With(
		slog.String("op", op),
		slog.String("appName", appName),
	)

	app, err := uc.app(ctx, appName)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	appSecret, err := app.Secret.Decrypt(uc.cfg.EncryptionSecret)
	if err != nil {
		log.Error("Failed to get app secret", slog.String("error", err.Error()))
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	appSession := &dto.AppSession{
		AppSessionMeta: dto.AppSessionMeta{
			AppID:       string(app.ID),
			Fingerprint: fingerprint,
		},
		Token: token,
	}
	session, err := uc.sessionUC.Refresh(ctx, appSession, appSecret)
	if err != nil {
		log.Error("Failed to refresh session", slog.String("error", err.Error()))
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return session, nil
}

func (uc *appUseCase) CreateSession(ctx context.Context, payload *dto.UserPayload, fingerprint *string, appName string) (*dto.Session, error) {
	const op = "usecase.appUseCase.CreateSession"
	log := uc.log.With(
		slog.String("op", op),
		slog.Any("payload", payload),
		slog.String("appName", appName),
	)

	log.Debug("Creating new session")
	app, err := uc.app(ctx, appName)
	if err != nil {
		log.Error("Failed to get app", slog.String("error", err.Error()))
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	appSecret, err := app.Secret.Decrypt(uc.cfg.EncryptionSecret)
	if err != nil {
		log.Error("Failed to get app secret", slog.String("error", err.Error()))
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	meta := &dto.AppSessionMeta{AppID: string(app.ID), Fingerprint: fingerprint}
	session, err := uc.sessionUC.Create(ctx, payload, meta, appSecret)
	if err != nil {
		log.Error("Failed to generate token", slog.String("error", err.Error()))
		return nil, fmt.Errorf("%s: %w", op, err)
	}
	log.Debug("Session successfully created")

	return session, nil
}

func (uc *appUseCase) CreateApp(ctx context.Context, input *dto.CreateAppInput) (*dto.CreateAppResult, error) {
	const op = "usecase.appUseCase.CreateApp"
	log := uc.log.With(slog.String("op", op), slog.String("name", input.Name))

	log.Debug("Creating app")
	app, err := domain.NewApp(input.Name, uc.cfg.EncryptionSecret)
	if err != nil {
		log.Warn("Failed to create domain app", slog.String("error", err.Error()))
		return nil, parseDomainErr(err)
	}

	storedApp, err := uc.app(ctx, input.Name)
	if storedApp != nil || err == nil {
		return nil, fmt.Errorf("%s: %w", op, ErrAppAlreadyExists)
	}

	appID, err := uc.appRepo.SaveApp(ctx, app)
	if err != nil {
		log.Error("Failed to save app", slog.String("error", err.Error()), slog.Any("appID", app.ID))
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	log.Debug("Successfully created app", slog.Any("appID", app.ID))

	return &dto.CreateAppResult{AppID: string(appID)}, nil
}

func (uc *appUseCase) App(ctx context.Context, name string) (*dto.App, error) {
	app, err := uc.app(ctx, name)
	if err != nil {
		return nil, err
	}

	return &dto.App{
		ID:   string(app.ID),
		Name: string(app.Name),
	}, nil
}

func (uc *appUseCase) app(ctx context.Context, name string) (*domain.App, error) {
	const op = "usecase.appUseCase.app"
	log := uc.log.With(slog.String("op", op), slog.String("name", string(name)))

	appName, err := domain.NewName(name)
	if err != nil {
		log.Warn("Failed to create domain app name", slog.String("error", err.Error()))
		return nil, parseDomainErr(err)
	}

	app, err := uc.appRepo.App(ctx, appName)
	if err != nil {
		if errors.Is(err, storage.ErrAppNotFound) {
			return nil, ErrAppNotFound
		}
		log.Error("Failed to get app", slog.String("error", err.Error()))
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return app, nil
}
