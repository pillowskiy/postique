.PHONY: protoc

CONTRACTS_DIR := ../contracts
PROTO_DIR := $(CONTRACTS_DIR)/proto
PROTO_OUT := ./pb

# Find all .proto files recursively
PROTO_FILES := $(shell find ../contracts/proto -type f -name "*.proto" ! -path "*/_*/*")

protoc:
	@echo "[NestJS]: Compiling Protobuf files..."
	@mkdir -p $(PROTO_OUT)
	@protoc -I $(PROTO_DIR) \
		--plugin=./node_modules/.bin/protoc-gen-ts_proto \
		--ts_proto_out=$(PROTO_OUT) \
		--ts_proto_opt=outputServices=grpc-js \
		--ts_proto_opt=importSuffix=.js \
		--ts_proto_opt=initializeFieldsAsUndefined=false \
		--ts_proto_opt=fileSuffix=.pb \
		--ts_proto_opt=nestJs=true \
		$(PROTO_FILES)
	@echo "[NestJS]: Protobuf compilation completed!"

