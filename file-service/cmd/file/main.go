package main

import (
	"io"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/pillowskiy/postique/files/internal/app"
	"github.com/pillowskiy/postique/files/internal/config"
)

func main() {
	cfg := config.MustLoad()

	log := setupLogger(os.Stdout)

	app := app.NewApp(log, cfg)

	go app.MustRun()
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGTERM, syscall.SIGINT)
	sign := <-stop
	log.Info("Stopping application", slog.String("signal", sign.String()))
	app.GracefulStop()
}

func setupLogger(w io.Writer) *slog.Logger {
	return slog.New(slog.NewJSONHandler(w, &slog.HandlerOptions{Level: slog.LevelInfo}))
}
