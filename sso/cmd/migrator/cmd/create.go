package cmd

import (
	"flag"
	"fmt"
	"log/slog"
	"os"
	"time"
)

func RunMigrateCreate(log *slog.Logger) {
	var dir, migrationName string
	flag.StringVar(&dir, "dir", "migrations", "Path to directory with migrations")
	flag.StringVar(&migrationName, "name", "", "Migration name")
	flag.Parse()

	if dir == "" || migrationName == "" {
		flag.PrintDefaults()
		return
	}

	if _, err := os.Stat(dir); os.IsNotExist(err) {
		if err := os.Mkdir(dir, os.ModePerm); err != nil {
			log.Error("Failed to create migrations directory: %v", slog.String("error", err.Error()))
			return
		}
	}

	timestamp := time.Now().Format("20060102150405")
	upFile := fmt.Sprintf("%s/%s_%s.up.sql", dir, timestamp, migrationName)
	downFile := fmt.Sprintf("%s/%s_%s.down.sql", dir, timestamp, migrationName)

	if err := createFile(upFile); err != nil {
		log.Error("Failed to create up migration file", slog.String("error", err.Error()))
	}
	if err := createFile(downFile); err != nil {
		log.Error("Failed to create down migration file", slog.String("error", err.Error()))
	}

	log.Info("Created migration files", slog.String("up", upFile), slog.String("down", downFile))
}

func createFile(fileName string) error {
	file, err := os.Create(fileName)
	if err != nil {
		return err
	}
	return file.Close()
}
