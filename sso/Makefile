.PHONY: app

dev:
	@echo "Starting app in development enviroment"
	@go run cmd/sso/main.go --config=./config/development.yml

.PHONY: migrator

DB_URI := postgres://postique:postique@localhost:5432/sso
MIGRATION_DIR := ./migrations

pg_migrate:
	@go run cmd/migrator/main.go -uri=${DB_URI} -dir=$(MIGRATION_DIR) up

pg_reset:
	@go run cmd/migrator/main.go -uri=${DB_URI} -dir=$(MIGRATION_DIR) down

migrate_create:
	@go run cmd/migrator/main.go -dir=$(MIGRATION_DIR) -name=$(name) create
