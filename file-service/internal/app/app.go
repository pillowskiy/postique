package app

import (
	"log/slog"

	"github.com/pillowskiy/postique/files/internal/app/grpc"
	"github.com/pillowskiy/postique/files/internal/config"
	"github.com/pillowskiy/postique/files/internal/storage/s3"
	"github.com/pillowskiy/postique/files/internal/usecase"
)

type App struct {
	grpcApp *grpc.App
}

func NewApp(log *slog.Logger, cfg *config.Config) *App {

	s3Storage := s3.MustConnect(cfg.S3)

	fileStorage := s3.NewFileStorage(s3Storage)
	fileUseCase := usecase.NewFileService(fileStorage)
	appUseCase := usecase.NewAppUseCase(fileUseCase, cfg.DecryptKey, log)

	grpcApp := grpc.NewApp(log, cfg.Server, appUseCase, fileUseCase)
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
