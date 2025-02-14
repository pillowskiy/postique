import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
export const protobufPackage = "permission";
function createBaseHasPermissionRequest() {
    return { name: "" };
}
export const HasPermissionRequest = {
    encode(message, writer = new BinaryWriter()) {
        if (message.name !== "") {
            writer.uint32(10).string(message.name);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseHasPermissionRequest();
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
        return HasPermissionRequest.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseHasPermissionRequest();
        message.name = object.name ?? "";
        return message;
    },
};
function createBaseHasPermissionResponse() {
    return { hasPermission: false };
}
export const HasPermissionResponse = {
    encode(message, writer = new BinaryWriter()) {
        if (message.hasPermission !== false) {
            writer.uint32(8).bool(message.hasPermission);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseHasPermissionResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 8) {
                        break;
                    }
                    message.hasPermission = reader.bool();
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
        return { hasPermission: isSet(object.hasPermission) ? globalThis.Boolean(object.hasPermission) : false };
    },
    toJSON(message) {
        const obj = {};
        if (message.hasPermission !== false) {
            obj.hasPermission = message.hasPermission;
        }
        return obj;
    },
    create(base) {
        return HasPermissionResponse.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseHasPermissionResponse();
        message.hasPermission = object.hasPermission ?? false;
        return message;
    },
};
function createBaseHasUserPermissionRequest() {
    return { userId: "", name: "" };
}
export const HasUserPermissionRequest = {
    encode(message, writer = new BinaryWriter()) {
        if (message.userId !== "") {
            writer.uint32(10).string(message.userId);
        }
        if (message.name !== "") {
            writer.uint32(18).string(message.name);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseHasUserPermissionRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 10) {
                        break;
                    }
                    message.userId = reader.string();
                    continue;
                }
                case 2: {
                    if (tag !== 18) {
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
        return {
            userId: isSet(object.userId) ? globalThis.String(object.userId) : "",
            name: isSet(object.name) ? globalThis.String(object.name) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.userId !== "") {
            obj.userId = message.userId;
        }
        if (message.name !== "") {
            obj.name = message.name;
        }
        return obj;
    },
    create(base) {
        return HasUserPermissionRequest.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseHasUserPermissionRequest();
        message.userId = object.userId ?? "";
        message.name = object.name ?? "";
        return message;
    },
};
function createBaseHasUserPermissionResponse() {
    return { hasPermission: false };
}
export const HasUserPermissionResponse = {
    encode(message, writer = new BinaryWriter()) {
        if (message.hasPermission !== false) {
            writer.uint32(8).bool(message.hasPermission);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseHasUserPermissionResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 8) {
                        break;
                    }
                    message.hasPermission = reader.bool();
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
        return { hasPermission: isSet(object.hasPermission) ? globalThis.Boolean(object.hasPermission) : false };
    },
    toJSON(message) {
        const obj = {};
        if (message.hasPermission !== false) {
            obj.hasPermission = message.hasPermission;
        }
        return obj;
    },
    create(base) {
        return HasUserPermissionResponse.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseHasUserPermissionResponse();
        message.hasPermission = object.hasPermission ?? false;
        return message;
    },
};
export const PermissionServiceName = "permission.Permission";
export class PermissionClientImpl {
    rpc;
    service;
    constructor(rpc, opts) {
        this.service = opts?.service || PermissionServiceName;
        this.rpc = rpc;
        this.HasPermission = this.HasPermission.bind(this);
        this.HasUserPermission = this.HasUserPermission.bind(this);
    }
    HasPermission(request) {
        const data = HasPermissionRequest.encode(request).finish();
        const promise = this.rpc.request(this.service, "HasPermission", data);
        return promise.then((data) => HasPermissionResponse.decode(new BinaryReader(data)));
    }
    HasUserPermission(request) {
        const data = HasUserPermissionRequest.encode(request).finish();
        const promise = this.rpc.request(this.service, "HasUserPermission", data);
        return promise.then((data) => HasUserPermissionResponse.decode(new BinaryReader(data)));
    }
}
function isSet(value) {
    return value !== null && value !== undefined;
}
