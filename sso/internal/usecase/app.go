package usecase

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	"github.com/pillowskiy/postique/sso/internal/config"
	"github.com/pillowskiy/postique/sso/internal/domain"
	"github.com/pillowskiy/postique/sso/internal/dto"
	"github.com/pillowskiy/postique/sso/internal/lib/jwt"
	"github.com/pillowskiy/postique/sso/internal/storage"
)

var ErrAppAlreadyExists = errors.New("app already exists")

type AppRepository interface {
	App(ctx context.Context, name domain.Name) (*domain.App, error)
	SaveApp(ctx context.Context, app *domain.App) (domain.ID, error)
}

type appUseCase struct {
	appRepo AppRepository
	cfg     config.Session
	log     *slog.Logger
}

func NewAppUseCase(appRepo AppRepository, cfg config.Session, log *slog.Logger) *appUseCase {
	return &appUseCase{appRepo: appRepo, cfg: cfg, log: log}
}

func (uc *appUseCase) GenerateToken(ctx context.Context, user *domain.User, appName domain.Name) (string, error) {
	const op = "usecase.appUseCase.GenToken"
	log := uc.log.With(
		slog.String("op", op),
		slog.Group("user",
			slog.String("email", string(user.Email)),
			slog.String("id", string(user.ID)),
		),
		slog.String("appName", string(appName)),
	)

	app, err := uc.app(ctx, appName)
	if err != nil {
		return "", fmt.Errorf("%s: %w", op, err)
	}

	dSecret, err := app.Secret.Decrypt(uc.cfg.Secret)
	if err != nil {
		uc.log.Error("Failed to decrypt app secret", slog.String("error", err.Error()))
		return "", fmt.Errorf("%s: %w", op, err)
	}

	token, err := jwt.NewToken(user, dSecret, uc.cfg.TokenTTL)
	if err != nil {
		log.Error("Failed to generate token", slog.String("error", err.Error()))
		return "", fmt.Errorf("%s: %w", op, err)
	}

	return token, nil
}

func (uc *appUseCase) CreateApp(ctx context.Context, dto *dto.CreateAppDTO) (domain.ID, error) {
	const op = "usecase.appUseCase.CreateApp"
	log := uc.log.With(slog.String("op", op), slog.String("name", dto.Name))

	log.Debug("Creating app")
	app, err := domain.NewApp(dto.Name, uc.cfg.Secret)
	if err != nil {
		log.Warn("Failed to create domain app", slog.String("error", err.Error()))
		return domain.EmptyID, fmt.Errorf("%s: %w", op, err)
	}

	storedApp, err := uc.app(ctx, app.Name)
	if storedApp != nil || err == nil {
		log.Debug("App already exists", slog.String("error", err.Error()))
		return domain.EmptyID, fmt.Errorf("%s: %w", op, ErrAppAlreadyExists)
	}

	appID, err := uc.appRepo.SaveApp(ctx, app)
	if err != nil {
		log.Error("Failed to save app", slog.String("error", err.Error()), slog.Any("appID", app.ID))
		return domain.EmptyID, fmt.Errorf("%s: %w", op, err)
	}

	log.Debug("Successfully created app", slog.Any("appID", app.ID))

	return appID, nil
}

func (uc *appUseCase) App(ctx context.Context, name string) (*domain.App, error) {
	const op = "usecase.appUseCase.App"
	log := uc.log.With(slog.String("op", op), slog.String("name", name))

	appName, err := domain.NewName(name)
	if err != nil {
		log.Warn("Failed to create domain app name", slog.String("error", err.Error()))
		return nil, err
	}

	return uc.app(ctx, appName)
}

func (uc *appUseCase) app(ctx context.Context, name domain.Name) (*domain.App, error) {
	const op = "usecase.appUseCase.app"
	log := uc.log.With(slog.String("op", op), slog.String("name", string(name)))

	app, err := uc.appRepo.App(ctx, name)
	if err != nil {
		if !errors.Is(err, storage.ErrAppNotFound) {
			log.Error("Failed to get app", slog.String("error", err.Error()))
		}
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return app, nil
}
