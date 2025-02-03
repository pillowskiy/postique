.PHONY: protoc

CONTRACTS_DIR := ./contracts
PROTO_DIR := $(CONTRACTS_DIR)/proto
PROTOC_OUT := $(CONTRACTS_DIR)/gen

# Find all .proto files recursively
PROTO_FILES := $(shell find ./contracts/proto -type f -name "*.proto" ! -path "*/_*/*")

protoc-go:
	@echo "Compiling Protobuf files with validation..."
	@protoc -I $(PROTO_DIR) \
		--go_out=$(PROTOC_OUT)/go \
		--go_opt=paths=source_relative \
		--go-grpc_out=$(PROTOC_OUT)/go \
		--go-grpc_opt=paths=source_relative \
		--validate_out=lang=go,paths=source_relative:$(PROTOC_OUT)/go \
		$(PROTO_FILES)
	@echo "Protobuf compilation with validation completed!"

PROTOC_IMAGE := rvolosatovs/protoc:latest
