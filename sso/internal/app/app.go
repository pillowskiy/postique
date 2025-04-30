package app

import (
	"context"
	"log/slog"
	"net/http"

	"github.com/pillowskiy/postique/sso/internal/app/grpc"
	"github.com/pillowskiy/postique/sso/internal/config"
	"github.com/pillowskiy/postique/sso/internal/infrastructure/rmq"
	"github.com/pillowskiy/postique/sso/internal/storage/pg"
	"github.com/pillowskiy/postique/sso/internal/usecase"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

type App struct {
	grpcApp    *grpc.App
	userPub    *rmq.RabbitMQProducer
	httpServer *http.Server
}

func New(log *slog.Logger, cfg *config.Config) *App {
	pgStorage := pg.MustConnect(cfg.Postgres)
	userPub := rmq.MustRabbitMQProducer(
		cfg.RabbitMQ.URL,
		cfg.RabbitMQ.Exchange,
		"",
	)

	roleRepo := pg.NewRoleStorage(pgStorage)
	roleUC := usecase.NewRoleUseCase(roleRepo, log)

	permRepo := pg.NewPermissionStorage(pgStorage)
	permUC := usecase.NewPermissionUseCase(permRepo, roleUC, log)

	sessionRepo := pg.NewSessionStorage(pgStorage)
	sessionUC := usecase.NewSessionUseCase(sessionRepo, cfg.Session, log)

	appRepo := pg.NewAppStorage(pgStorage)
	appUC := usecase.NewAppUseCase(appRepo, sessionUC, cfg.Session, log)

	profileRepo := pg.NewProfileStorage(pgStorage)
	profileUC := usecase.NewProfileUseCase(profileRepo, userPub, log)

	authRepo := pg.NewUserStorage(pgStorage)
	authUC := usecase.NewAuthUseCase(authRepo, appUC, userPub, profileUC, log)

	grpcApp := grpc.NewApp(log, cfg.Server, appUC, authUC, permUC, profileUC)

	mux := http.NewServeMux()
	mux.Handle("/metrics", promhttp.Handler())

	metricsServer := &http.Server{
		Addr:    ":9091",
		Handler: mux,
	}

	return &App{
		grpcApp:    grpcApp,
		userPub:    userPub,
		httpServer: metricsServer,
	}
}

func (a *App) MustRun() {
	go func() {
		if err := a.httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			panic(err)
		}
	}()

	if err := a.grpcApp.Run(); err != nil {
		panic(err)
	}
}

func (a *App) GracefulStop() {
	a.grpcApp.Stop()
	a.userPub.Close()

	if err := a.httpServer.Shutdown(context.Background()); err != nil {
		slog.Error("Error shutting down metrics server", "error", err)
	}
}
