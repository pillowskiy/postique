.PHONY: protoc

CONTRACTS_DIR := ../proto
PROTOC_GO_OUT := ./gen

# Find all .proto files recursively
PROTO_FILES := $(shell find $(CONTRACTS_DIR) -name "*.proto")

protoc:
	@echo "Compiling Protobuf files..."
	@mkdir -p $(PROTOC_GO_OUT)
	@protoc -I $(CONTRACTS_DIR) \
		--go_out=$(PROTOC_GO_OUT) \
		--go_opt=paths=source_relative \
		--go-grpc_out=$(PROTOC_GO_OUT) \
		--go-grpc_opt=paths=source_relative \
		$(PROTO_FILES)
	@echo "Protobuf compilation completed!"

.PHONY: app

dev:
	@echo "Starting app in development enviroment"
	@go run cmd/sso/main.go --config=./config/development.yml
