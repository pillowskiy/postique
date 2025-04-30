package grpc

import (
	"fmt"
	"log/slog"
	"net"

	grpc_prometheus "github.com/grpc-ecosystem/go-grpc-prometheus"
	"github.com/pillowskiy/postique/sso/internal/config"
	"github.com/pillowskiy/postique/sso/internal/delivery/grpc/interceptor"
	"github.com/pillowskiy/postique/sso/internal/delivery/grpc/server"
	"google.golang.org/grpc"
)

type App struct {
	log        *slog.Logger
	grpcServer *grpc.Server
	cfg        config.Server
}

func NewApp(
	log *slog.Logger,
	cfg config.Server,
	appUC server.AppUseCase,
	authUC server.AuthUseCase,
	permUC server.PermissionUseCase,
	profileUC server.ProfileUseCase,
) *App {
	grpcServer := grpc.NewServer(
		grpc.ChainUnaryInterceptor(
			grpc_prometheus.UnaryServerInterceptor,
			interceptor.UnaryWithMetrics(log),

			interceptor.UnaryWithAuth(authUC)(
				interceptor.Method("sso.permission", "*", "HasPermission"),
				interceptor.Method("sso.auth", "*", "Verify"),
			),
			interceptor.UnarySelfOrHasPermission(permUC, log, "edit:user")(
				interceptor.Method("sso.profile", "*", "UpdateProfile"),
			),
		),
		grpc.ChainStreamInterceptor(
			grpc_prometheus.StreamServerInterceptor,
		),
	)

	server.RegisterAppServer(grpcServer, appUC)
	server.RegisterAuthServer(grpcServer, authUC)
	server.RegisterPermissionServer(grpcServer, permUC)
	server.RegisterProfileServer(grpcServer, profileUC)

	grpc_prometheus.EnableHandlingTimeHistogram()
	grpc_prometheus.Register(grpcServer)

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
