package main

import (
	"io"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/pillowskiy/postique/sso/internal/app"
	"github.com/pillowskiy/postique/sso/internal/config"
	"github.com/pillowskiy/postique/sso/pkg/logger"
)

func main() {
	cfg := config.MustLoad()

	log := setupLogger(os.Stdout, cfg.Logger)

	app := app.New(log, cfg)

	go app.MustRun()
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGTERM, syscall.SIGINT)
	sign := <-stop
	log.Info("Stopping application", slog.String("signal", sign.String()))
	app.GracefulStop()
}

func setupLogger(w io.Writer, cfg config.Logger) *slog.Logger {
	opts := &logger.Options{
		HandlerType: logger.ParseHandlerType(cfg.Encoding),
		AddSource:   !cfg.DisableStacktrace,
		Level:       logger.ParseLevel(cfg.Level),
	}

	return logger.NewSlog(w, opts)
}
