package cmd

import (
	"errors"
	"flag"
	"fmt"
	"log/slog"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func RunMigrateFromType(log *slog.Logger, mType string) {
	var dbURI, migrationsDir, migrationsTable string
	flag.StringVar(&dbURI, "uri", "", "Database connection string")
	flag.StringVar(&migrationsDir, "dir", "migrations", "Path to directory with migrations")
	flag.StringVar(&migrationsTable, "table", "migrations", "Name of migrations table")
	flag.Parse()

	if dbURI == "" || migrationsDir == "" || migrationsTable == "" {
		flag.PrintDefaults()
		return
	}

	m, err := migrate.New(
		"file://"+migrationsDir,
		fmt.Sprintf("%s?x-migrations-table=%s", dbURI, migrationsTable),
	)
	if err != nil {
		log.Error(
			"Failed to prepare migrator tool",
			slog.String("dir", migrationsDir),
			slog.String("table", migrationsTable),
			slog.String("error", err.Error()),
		)
		return
	}
	log.Info("Successfully prepared for migration")

	var migErr error
	switch mType {
	case "up":
		log.Info("Run migrator up command")
		migErr = m.Up()
	case "down":
		log.Info("Run migrator down command")
		migErr = m.Down()
	}

	if migErr != nil {
		if errors.Is(err, migrate.ErrNoChange) {
			log.Info("No migrations to apply")
			return
		}

		log.Error("Failed to run migration", slog.String("error", migErr.Error()))
	}

	log.Info("Migrations applied")
}
