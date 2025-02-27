import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { makeGenericClientConstructor, } from "@grpc/grpc-js";
export const protobufPackage = "files.app";
function createBaseCreateAppRequest() {
    return { name: "", bucket: "" };
}
export const CreateAppRequest = {
    encode(message, writer = new BinaryWriter()) {
        if (message.name !== "") {
            writer.uint32(10).string(message.name);
        }
        if (message.bucket !== "") {
            writer.uint32(18).string(message.bucket);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCreateAppRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 10) {
                        break;
                    }
                    message.name = reader.string();
                    continue;
                }
                case 2: {
                    if (tag !== 18) {
                        break;
                    }
                    message.bucket = reader.string();
                    continue;
                }
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skip(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            name: isSet(object.name) ? globalThis.String(object.name) : "",
            bucket: isSet(object.bucket) ? globalThis.String(object.bucket) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.name !== "") {
            obj.name = message.name;
        }
        if (message.bucket !== "") {
            obj.bucket = message.bucket;
        }
        return obj;
    },
    create(base) {
        return CreateAppRequest.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseCreateAppRequest();
        message.name = object.name ?? "";
        message.bucket = object.bucket ?? "";
        return message;
    },
};
function createBaseCreateAppResponse() {
    return { token: "" };
}
export const CreateAppResponse = {
    encode(message, writer = new BinaryWriter()) {
        if (message.token !== "") {
            writer.uint32(10).string(message.token);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCreateAppResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 10) {
                        break;
                    }
                    message.token = reader.string();
                    continue;
                }
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skip(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return { token: isSet(object.token) ? globalThis.String(object.token) : "" };
    },
    toJSON(message) {
        const obj = {};
        if (message.token !== "") {
            obj.token = message.token;
        }
        return obj;
    },
    create(base) {
        return CreateAppResponse.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseCreateAppResponse();
        message.token = object.token ?? "";
        return message;
    },
};
export const AppService = {
    createApp: {
        path: "/files.app.App/CreateApp",
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from(CreateAppRequest.encode(value).finish()),
        requestDeserialize: (value) => CreateAppRequest.decode(value),
        responseSerialize: (value) => Buffer.from(CreateAppResponse.encode(value).finish()),
        responseDeserialize: (value) => CreateAppResponse.decode(value),
    },
};
export const AppClient = makeGenericClientConstructor(AppService, "files.app.App");
function isSet(value) {
    return value !== null && value !== undefined;
}
