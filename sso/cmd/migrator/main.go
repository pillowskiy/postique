package main

import (
	"errors"
	"io"
	"log/slog"
	"os"
	"strings"

	"github.com/pillowskiy/postique/sso/cmd/migrator/cmd"
	"github.com/pillowskiy/postique/sso/pkg/logger"
)

func main() {
	log := setupLogger(os.Stdout)

	cmdName, err := getCommandName()
	if err != nil {
		log.Error("Unknown command", slog.String("error", err.Error()))
		return
	}
	log = log.With(slog.String("cmd", cmdName))

	switch cmdName {
	case "up", "down":
		cmd.RunMigrateFromType(log, cmdName)
	case "create":
		cmd.RunMigrateCreate(log)
	default:
		log.Error("Unknown command")
		return
	}
}

func setupLogger(w io.Writer) *slog.Logger {
	opts := &logger.Options{
		HandlerType: logger.HandlerTypePretty,
		AddSource:   false,
		Level:       logger.ParseLevel("debug"),
	}

	return logger.NewSlog(w, opts)
}

func getCommandName() (string, error) {
	for _, arg := range os.Args[1:] {
		if !strings.HasPrefix(arg, "-") {
			return strings.ToLower(arg), nil
		}
	}

	return "", errors.New("command name not found")
}
