.PHONY: protoc

CONTRACTS_DIR := ./contracts
PROTO_DIR := $(CONTRACTS_DIR)/proto
PROTOC_OUT := $(CONTRACTS_DIR)/gen

# Find all .proto files recursively
PROTO_FILES := $(shell find ./contracts/proto -type f -name "*.proto" ! -path "*/_*/*")

protoc-go:
	@echo "[GO]: Compiling Protobuf files..."
	@protoc -I $(PROTO_DIR) \
		--go_out=$(PROTOC_OUT)/go \
		--go_opt=paths=source_relative \
		--go-grpc_out=$(PROTOC_OUT)/go \
		--go-grpc_opt=paths=source_relative \
		--validate_out=lang=go,paths=source_relative:$(PROTOC_OUT)/go \
		$(PROTO_FILES)
	@echo "[GO]: Protobuf compilation completed!"

JS_PROTO_OUT := $(PROTOC_OUT)/js/gen
protoc-js:
	@echo "[JS]: Compiling Protobuf files..."
	@mkdir -p $(JS_PROTO_OUT)
	@protoc -I $(PROTO_DIR) \
		--plugin=$(PROTOC_OUT)/js/node_modules/.bin/protoc-gen-ts_proto \
		--ts_proto_out=$(JS_PROTO_OUT) \
		--ts_proto_opt=outputServices=grpc-js \
		--ts_proto_opt=outputClientImpl=grpc-js \
		--ts_proto_opt=importSuffix=.js \
		--ts_proto_opt=esModuleInterop=true \
		--ts_proto_opt=initializeFieldsAsUndefined=false \
		--ts_proto_opt=fileSuffix=.pb \
		$(PROTO_FILES)
	@npm --prefix $(PROTOC_OUT)/js run build
	@rm -rf $(JS_PROTO_OUT)/*
	@echo "[JS]: Protobuf compilation completed!"

.PHONY: app

dev:
	@echo "Starting application in development enviroment"
	@tilt up --write
