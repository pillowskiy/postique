.PHONY: protoc

CONTRACTS_DIR := ../proto
PROTOC_GO_OUT := ./gen

# Find all .proto files recursively
PROTO_FILES := $(shell find $(CONTRACTS_DIR) -name "*.proto")

protoc:
	@echo "Compiling Protobuf files with validation..."
	@mkdir -p $(PROTOC_GO_OUT) $(PROTOC_VALIDATE_OUT)
	@protoc -I $(CONTRACTS_DIR) \
		--go_out=$(PROTOC_GO_OUT) \
		--go_opt=paths=source_relative \
		--go-grpc_out=$(PROTOC_GO_OUT) \
		--go-grpc_opt=paths=source_relative \
		--validate_out=lang=go,paths=source_relative:$(PROTOC_GO_OUT) \
		$(PROTO_FILES)
	@echo "Protobuf compilation with validation completed!"

.PHONY: app

dev:
	@echo "Starting app in development enviroment"
	@go run cmd/sso/main.go --config=./config/development.yml
