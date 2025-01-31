package app

import (
	"log/slog"

	"github.com/pillowskiy/postique/sso/internal/app/grpc"
	"github.com/pillowskiy/postique/sso/internal/config"
)

type App struct {
	grpcApp *grpc.App
}

func New(log *slog.Logger, cfg *config.Config) *App {
	grpcApp := grpc.NewApp(log, cfg.Server)

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
