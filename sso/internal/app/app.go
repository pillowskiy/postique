package app

import (
	"log/slog"

	"github.com/pillowskiy/postique/sso/internal/app/grpc"
	"github.com/pillowskiy/postique/sso/internal/config"
	"github.com/pillowskiy/postique/sso/internal/storage/pg"
	"github.com/pillowskiy/postique/sso/internal/usecase"
)

type App struct {
	grpcApp *grpc.App
}

func New(log *slog.Logger, cfg *config.Config) *App {
	pgStorage := pg.MustConnect(cfg.Postgres)

	roleRepo := pg.NewRoleStorage(pgStorage)
	roleUC := usecase.NewRoleUseCase(roleRepo, log)

	permRepo := pg.NewPermissionStorage(pgStorage)
	permUC := usecase.NewPermissionUseCase(permRepo, roleUC, log)

	sessionRepo := pg.NewSessionStorage(pgStorage)
	sessionUC := usecase.NewSessionUseCase(sessionRepo, cfg.Session, log)

	appRepo := pg.NewAppStorage(pgStorage)
	appUC := usecase.NewAppUseCase(appRepo, sessionUC, cfg.Session, log)

	authRepo := pg.NewUserStorage(pgStorage)
	authUC := usecase.NewAuthUseCase(authRepo, appUC, log)

	grpcApp := grpc.NewApp(log, cfg.Server, appUC, authUC, permUC)

	return &App{grpcApp: grpcApp}
}

func (a *App) MustRun() {
	if err := a.grpcApp.Run(); err != nil {
		panic(err)
	}
}

func (a *App) GracefulStop() {
	a.grpcApp.Stop()
}
