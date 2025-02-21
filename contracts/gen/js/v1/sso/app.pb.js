import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { makeGenericClientConstructor, } from "@grpc/grpc-js";
export const protobufPackage = "app";
function createBaseCreateAppRequest() {
    return { name: "" };
}
export const CreateAppRequest = {
    encode(message, writer = new BinaryWriter()) {
        if (message.name !== "") {
            writer.uint32(10).string(message.name);
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
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skip(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return { name: isSet(object.name) ? globalThis.String(object.name) : "" };
    },
    toJSON(message) {
        const obj = {};
        if (message.name !== "") {
            obj.name = message.name;
        }
        return obj;
    },
    create(base) {
        return CreateAppRequest.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseCreateAppRequest();
        message.name = object.name ?? "";
        return message;
    },
};
function createBaseCreateAppResponse() {
    return { appId: "" };
}
export const CreateAppResponse = {
    encode(message, writer = new BinaryWriter()) {
        if (message.appId !== "") {
            writer.uint32(10).string(message.appId);
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
                    message.appId = reader.string();
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
        return { appId: isSet(object.appId) ? globalThis.String(object.appId) : "" };
    },
    toJSON(message) {
        const obj = {};
        if (message.appId !== "") {
            obj.appId = message.appId;
        }
        return obj;
    },
    create(base) {
        return CreateAppResponse.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseCreateAppResponse();
        message.appId = object.appId ?? "";
        return message;
    },
};
export const AppService = {
    createApp: {
        path: "/app.App/CreateApp",
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from(CreateAppRequest.encode(value).finish()),
        requestDeserialize: (value) => CreateAppRequest.decode(value),
        responseSerialize: (value) => Buffer.from(CreateAppResponse.encode(value).finish()),
        responseDeserialize: (value) => CreateAppResponse.decode(value),
    },
};
export const AppClient = makeGenericClientConstructor(AppService, "app.App");
function isSet(value) {
    return value !== null && value !== undefined;
}
