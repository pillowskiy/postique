import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { makeGenericClientConstructor, } from "@grpc/grpc-js";
export const protobufPackage = "files.file";
function createBaseUploadRequest() {
    return { data: new Uint8Array(0), filename: "", contentType: "" };
}
export const UploadRequest = {
    encode(message, writer = new BinaryWriter()) {
        if (message.data.length !== 0) {
            writer.uint32(10).bytes(message.data);
        }
        if (message.filename !== "") {
            writer.uint32(18).string(message.filename);
        }
        if (message.contentType !== "") {
            writer.uint32(26).string(message.contentType);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseUploadRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 10) {
                        break;
                    }
                    message.data = reader.bytes();
                    continue;
                }
                case 2: {
                    if (tag !== 18) {
                        break;
                    }
                    message.filename = reader.string();
                    continue;
                }
                case 3: {
                    if (tag !== 26) {
                        break;
                    }
                    message.contentType = reader.string();
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
            data: isSet(object.data) ? bytesFromBase64(object.data) : new Uint8Array(0),
            filename: isSet(object.filename) ? globalThis.String(object.filename) : "",
            contentType: isSet(object.contentType) ? globalThis.String(object.contentType) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.data.length !== 0) {
            obj.data = base64FromBytes(message.data);
        }
        if (message.filename !== "") {
            obj.filename = message.filename;
        }
        if (message.contentType !== "") {
            obj.contentType = message.contentType;
        }
        return obj;
    },
    create(base) {
        return UploadRequest.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseUploadRequest();
        message.data = object.data ?? new Uint8Array(0);
        message.filename = object.filename ?? "";
        message.contentType = object.contentType ?? "";
        return message;
    },
};
function createBaseUploadResponse() {
    return { path: "" };
}
export const UploadResponse = {
    encode(message, writer = new BinaryWriter()) {
        if (message.path !== "") {
            writer.uint32(10).string(message.path);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseUploadResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 10) {
                        break;
                    }
                    message.path = reader.string();
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
        return { path: isSet(object.path) ? globalThis.String(object.path) : "" };
    },
    toJSON(message) {
        const obj = {};
        if (message.path !== "") {
            obj.path = message.path;
        }
        return obj;
    },
    create(base) {
        return UploadResponse.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseUploadResponse();
        message.path = object.path ?? "";
        return message;
    },
};
function createBaseDeleteRequest() {
    return { path: "" };
}
export const DeleteRequest = {
    encode(message, writer = new BinaryWriter()) {
        if (message.path !== "") {
            writer.uint32(10).string(message.path);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDeleteRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 10) {
                        break;
                    }
                    message.path = reader.string();
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
        return { path: isSet(object.path) ? globalThis.String(object.path) : "" };
    },
    toJSON(message) {
        const obj = {};
        if (message.path !== "") {
            obj.path = message.path;
        }
        return obj;
    },
    create(base) {
        return DeleteRequest.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseDeleteRequest();
        message.path = object.path ?? "";
        return message;
    },
};
function createBaseDeleteResponse() {
    return { path: "" };
}
export const DeleteResponse = {
    encode(message, writer = new BinaryWriter()) {
        if (message.path !== "") {
            writer.uint32(10).string(message.path);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDeleteResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 10) {
                        break;
                    }
                    message.path = reader.string();
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
        return { path: isSet(object.path) ? globalThis.String(object.path) : "" };
    },
    toJSON(message) {
        const obj = {};
        if (message.path !== "") {
            obj.path = message.path;
        }
        return obj;
    },
    create(base) {
        return DeleteResponse.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseDeleteResponse();
        message.path = object.path ?? "";
        return message;
    },
};
export const FileService = {
    upload: {
        path: "/files.file.File/Upload",
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from(UploadRequest.encode(value).finish()),
        requestDeserialize: (value) => UploadRequest.decode(value),
        responseSerialize: (value) => Buffer.from(UploadResponse.encode(value).finish()),
        responseDeserialize: (value) => UploadResponse.decode(value),
    },
    delete: {
        path: "/files.file.File/Delete",
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from(DeleteRequest.encode(value).finish()),
        requestDeserialize: (value) => DeleteRequest.decode(value),
        responseSerialize: (value) => Buffer.from(DeleteResponse.encode(value).finish()),
        responseDeserialize: (value) => DeleteResponse.decode(value),
    },
};
export const FileClient = makeGenericClientConstructor(FileService, "files.file.File");
function bytesFromBase64(b64) {
    if (globalThis.Buffer) {
        return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
    }
    else {
        const bin = globalThis.atob(b64);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; ++i) {
            arr[i] = bin.charCodeAt(i);
        }
        return arr;
    }
}
function base64FromBytes(arr) {
    if (globalThis.Buffer) {
        return globalThis.Buffer.from(arr).toString("base64");
    }
    else {
        const bin = [];
        arr.forEach((byte) => {
            bin.push(globalThis.String.fromCharCode(byte));
        });
        return globalThis.btoa(bin.join(""));
    }
}
function isSet(value) {
    return value !== null && value !== undefined;
}
