.PHONY: init

keygen:
	@echo "Generating app keys"
	@go run cmd/keygen/main.go -privout=../.keys/private/access_token.pem -pubout=../.keys/public/access_token.pem

.PHONY: app

env_dev:
	@echo "Starting app in development enviroment"
	@go run cmd/sso/main.go --config=./config/development.yml

env_test:
	@echo "Starting app in testing enviroment"
	@go run cmd/sso/main.go --config=./config/test.yml

.PHONY: migrator

DATABASE_NAME := sso
DATABASE_URI := postgres://postique:postique@localhost:5432/$(DATABASE_NAME)
MIGRATION_DIR := ./migrations
MIGRATION_TABLE := migrations

# Overwrite usage: make pg_migrate MIGRATION_DIR=./tests/migrations MIGRATION_TABLE=migrations_test DATABASE_NAME=sso_test
pg_migrate:
	@go run cmd/migrator/main.go -uri=${DATABASE_URI} -dir=$(MIGRATION_DIR) -table=$(MIGRATION_TABLE) up

pg_reset:
	@go run cmd/migrator/main.go -uri=${DATABASE_URI} -dir=$(MIGRATION_DIR) -table=$(MIGRATION_TABLE) down

migrate_create:
	@go run cmd/migrator/main.go -dir=$(MIGRATION_DIR) -name=$(MIGRATION_NAME) create
