package main

import (
	"io"
	"log/slog"
	"os"

	"github.com/pillowskiy/postique/sso/internal/config"
	"github.com/pillowskiy/postique/sso/pkg/logger"
)

func main() {
	cfg := config.MustLoad()

	log := setupLogger(os.Stdout, cfg.Logger)

	log.Info("Starting application", slog.Int("port", cfg.Server.Port))
}

func setupLogger(w io.Writer, cfg config.Logger) *slog.Logger {
	opts := &logger.Options{
		HandlerType: logger.ParseHandlerType(cfg.Encoding),
		AddSource:   !cfg.DisableStacktrace,
		Level:       logger.ParseLevel(cfg.Level),
	}

	return logger.NewSlog(w, opts)
}
