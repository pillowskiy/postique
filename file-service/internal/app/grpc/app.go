package grpc

import (
	"context"
	"fmt"
	"log/slog"
	"net"

	"github.com/pillowskiy/postique/files/internal/config"
	"github.com/pillowskiy/postique/files/internal/delivery/grpc/interceptor"
	"github.com/pillowskiy/postique/files/internal/delivery/grpc/server"
	"github.com/pillowskiy/postique/files/internal/dto"
	"google.golang.org/grpc"
)

type AppUseCase interface {
	CreateApp(ctx context.Context, name, bucket string) (string, error)
	DecryptApp(ctx context.Context, token string) (*dto.AppPayload, error)
}

type App struct {
	log        *slog.Logger
	grpcServer *grpc.Server
	cfg        config.Server
}

func NewApp(
	log *slog.Logger,
	cfg config.Server,
	appUC AppUseCase,
	fileUC server.FileUseCase,
) *App {
	grpcServer := grpc.NewServer(
		grpc.UnaryInterceptor(interceptor.UnaryWithAuth(appUC, log)),
	)

	server.RegisterAppServer(grpcServer, appUC)
	server.RegisterFileServer(grpcServer, fileUC)

	return &App{log: log, grpcServer: grpcServer, cfg: cfg}
}

func (a *App) Run() error {
	const op = "grpc.App.Run"
	log := a.log.With(slog.String("op", op), slog.Int("port", a.cfg.Port))

	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", a.cfg.Port))
	if err != nil {
		return fmt.Errorf("%s: %w", op, err)
	}

	log.Info("The gRPC server has started successfully", slog.String("addr", lis.Addr().String()))

	if err := a.grpcServer.Serve(lis); err != nil {
		return fmt.Errorf("%s: %w", op, err)
	}

	return nil
}

func (a *App) Stop() {
	const op = "grpc.App.Stop"

	a.log.With(slog.String("op", op)).Info("Stopping gRPC server", slog.Int("port", a.cfg.Port))
	a.grpcServer.GracefulStop()
}
