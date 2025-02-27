import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { makeGenericClientConstructor, } from "@grpc/grpc-js";
export const protobufPackage = "soo.auth";
function createBaseRegisterRequest() {
    return { email: "", password: "" };
}
export const RegisterRequest = {
    encode(message, writer = new BinaryWriter()) {
        if (message.email !== "") {
            writer.uint32(10).string(message.email);
        }
        if (message.password !== "") {
            writer.uint32(18).string(message.password);
        }
        if (message.username !== undefined) {
            writer.uint32(26).string(message.username);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRegisterRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 10) {
                        break;
                    }
                    message.email = reader.string();
                    continue;
                }
                case 2: {
                    if (tag !== 18) {
                        break;
                    }
                    message.password = reader.string();
                    continue;
                }
                case 3: {
                    if (tag !== 26) {
                        break;
                    }
                    message.username = reader.string();
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
            email: isSet(object.email) ? globalThis.String(object.email) : "",
            password: isSet(object.password) ? globalThis.String(object.password) : "",
            username: isSet(object.username) ? globalThis.String(object.username) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.email !== "") {
            obj.email = message.email;
        }
        if (message.password !== "") {
            obj.password = message.password;
        }
        if (message.username !== undefined) {
            obj.username = message.username;
        }
        return obj;
    },
    create(base) {
        return RegisterRequest.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseRegisterRequest();
        message.email = object.email ?? "";
        message.password = object.password ?? "";
        message.username = object.username ?? undefined;
        return message;
    },
};
function createBaseRegisterResponse() {
    return { userId: "" };
}
export const RegisterResponse = {
    encode(message, writer = new BinaryWriter()) {
        if (message.userId !== "") {
            writer.uint32(10).string(message.userId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRegisterResponse();
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
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skip(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return { userId: isSet(object.userId) ? globalThis.String(object.userId) : "" };
    },
    toJSON(message) {
        const obj = {};
        if (message.userId !== "") {
            obj.userId = message.userId;
        }
        return obj;
    },
    create(base) {
        return RegisterResponse.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseRegisterResponse();
        message.userId = object.userId ?? "";
        return message;
    },
};
function createBaseLoginRequest() {
    return { email: "", password: "", appName: "" };
}
export const LoginRequest = {
    encode(message, writer = new BinaryWriter()) {
        if (message.email !== "") {
            writer.uint32(10).string(message.email);
        }
        if (message.password !== "") {
            writer.uint32(18).string(message.password);
        }
        if (message.appName !== "") {
            writer.uint32(26).string(message.appName);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseLoginRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 10) {
                        break;
                    }
                    message.email = reader.string();
                    continue;
                }
                case 2: {
                    if (tag !== 18) {
                        break;
                    }
                    message.password = reader.string();
                    continue;
                }
                case 3: {
                    if (tag !== 26) {
                        break;
                    }
                    message.appName = reader.string();
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
            email: isSet(object.email) ? globalThis.String(object.email) : "",
            password: isSet(object.password) ? globalThis.String(object.password) : "",
            appName: isSet(object.appName) ? globalThis.String(object.appName) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.email !== "") {
            obj.email = message.email;
        }
        if (message.password !== "") {
            obj.password = message.password;
        }
        if (message.appName !== "") {
            obj.appName = message.appName;
        }
        return obj;
    },
    create(base) {
        return LoginRequest.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseLoginRequest();
        message.email = object.email ?? "";
        message.password = object.password ?? "";
        message.appName = object.appName ?? "";
        return message;
    },
};
function createBaseLoginResponse() {
    return { session: undefined };
}
export const LoginResponse = {
    encode(message, writer = new BinaryWriter()) {
        if (message.session !== undefined) {
            Session.encode(message.session, writer.uint32(10).fork()).join();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseLoginResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 10) {
                        break;
                    }
                    message.session = Session.decode(reader, reader.uint32());
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
        return { session: isSet(object.session) ? Session.fromJSON(object.session) : undefined };
    },
    toJSON(message) {
        const obj = {};
        if (message.session !== undefined) {
            obj.session = Session.toJSON(message.session);
        }
        return obj;
    },
    create(base) {
        return LoginResponse.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseLoginResponse();
        message.session = (object.session !== undefined && object.session !== null)
            ? Session.fromPartial(object.session)
            : undefined;
        return message;
    },
};
function createBaseRefreshRequest() {
    return { token: "", appName: "" };
}
export const RefreshRequest = {
    encode(message, writer = new BinaryWriter()) {
        if (message.token !== "") {
            writer.uint32(10).string(message.token);
        }
        if (message.appName !== "") {
            writer.uint32(18).string(message.appName);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRefreshRequest();
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
                case 2: {
                    if (tag !== 18) {
                        break;
                    }
                    message.appName = reader.string();
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
            token: isSet(object.token) ? globalThis.String(object.token) : "",
            appName: isSet(object.appName) ? globalThis.String(object.appName) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.token !== "") {
            obj.token = message.token;
        }
        if (message.appName !== "") {
            obj.appName = message.appName;
        }
        return obj;
    },
    create(base) {
        return RefreshRequest.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseRefreshRequest();
        message.token = object.token ?? "";
        message.appName = object.appName ?? "";
        return message;
    },
};
function createBaseRefreshResponse() {
    return { session: undefined };
}
export const RefreshResponse = {
    encode(message, writer = new BinaryWriter()) {
        if (message.session !== undefined) {
            Session.encode(message.session, writer.uint32(10).fork()).join();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRefreshResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 10) {
                        break;
                    }
                    message.session = Session.decode(reader, reader.uint32());
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
        return { session: isSet(object.session) ? Session.fromJSON(object.session) : undefined };
    },
    toJSON(message) {
        const obj = {};
        if (message.session !== undefined) {
            obj.session = Session.toJSON(message.session);
        }
        return obj;
    },
    create(base) {
        return RefreshResponse.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseRefreshResponse();
        message.session = (object.session !== undefined && object.session !== null)
            ? Session.fromPartial(object.session)
            : undefined;
        return message;
    },
};
function createBaseSession() {
    return { accessToken: "", refreshToken: "", tokenType: "", expiresIn: 0 };
}
export const Session = {
    encode(message, writer = new BinaryWriter()) {
        if (message.accessToken !== "") {
            writer.uint32(10).string(message.accessToken);
        }
        if (message.refreshToken !== "") {
            writer.uint32(18).string(message.refreshToken);
        }
        if (message.tokenType !== "") {
            writer.uint32(26).string(message.tokenType);
        }
        if (message.expiresIn !== 0) {
            writer.uint32(32).int64(message.expiresIn);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSession();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 10) {
                        break;
                    }
                    message.accessToken = reader.string();
                    continue;
                }
                case 2: {
                    if (tag !== 18) {
                        break;
                    }
                    message.refreshToken = reader.string();
                    continue;
                }
                case 3: {
                    if (tag !== 26) {
                        break;
                    }
                    message.tokenType = reader.string();
                    continue;
                }
                case 4: {
                    if (tag !== 32) {
                        break;
                    }
                    message.expiresIn = longToNumber(reader.int64());
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
            accessToken: isSet(object.accessToken) ? globalThis.String(object.accessToken) : "",
            refreshToken: isSet(object.refreshToken) ? globalThis.String(object.refreshToken) : "",
            tokenType: isSet(object.tokenType) ? globalThis.String(object.tokenType) : "",
            expiresIn: isSet(object.expiresIn) ? globalThis.Number(object.expiresIn) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.accessToken !== "") {
            obj.accessToken = message.accessToken;
        }
        if (message.refreshToken !== "") {
            obj.refreshToken = message.refreshToken;
        }
        if (message.tokenType !== "") {
            obj.tokenType = message.tokenType;
        }
        if (message.expiresIn !== 0) {
            obj.expiresIn = Math.round(message.expiresIn);
        }
        return obj;
    },
    create(base) {
        return Session.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseSession();
        message.accessToken = object.accessToken ?? "";
        message.refreshToken = object.refreshToken ?? "";
        message.tokenType = object.tokenType ?? "";
        message.expiresIn = object.expiresIn ?? 0;
        return message;
    },
};
function createBaseVerifyRequest() {
    return {};
}
export const VerifyRequest = {
    encode(_, writer = new BinaryWriter()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseVerifyRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skip(tag & 7);
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return VerifyRequest.fromPartial(base ?? {});
    },
    fromPartial(_) {
        const message = createBaseVerifyRequest();
        return message;
    },
};
function createBaseVerifyResponse() {
    return { userId: "", username: "", avatarPath: "" };
}
export const VerifyResponse = {
    encode(message, writer = new BinaryWriter()) {
        if (message.userId !== "") {
            writer.uint32(10).string(message.userId);
        }
        if (message.username !== "") {
            writer.uint32(18).string(message.username);
        }
        if (message.avatarPath !== "") {
            writer.uint32(26).string(message.avatarPath);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseVerifyResponse();
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
                    message.username = reader.string();
                    continue;
                }
                case 3: {
                    if (tag !== 26) {
                        break;
                    }
                    message.avatarPath = reader.string();
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
            username: isSet(object.username) ? globalThis.String(object.username) : "",
            avatarPath: isSet(object.avatarPath) ? globalThis.String(object.avatarPath) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.userId !== "") {
            obj.userId = message.userId;
        }
        if (message.username !== "") {
            obj.username = message.username;
        }
        if (message.avatarPath !== "") {
            obj.avatarPath = message.avatarPath;
        }
        return obj;
    },
    create(base) {
        return VerifyResponse.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseVerifyResponse();
        message.userId = object.userId ?? "";
        message.username = object.username ?? "";
        message.avatarPath = object.avatarPath ?? "";
        return message;
    },
};
export const AuthService = {
    register: {
        path: "/soo.auth.Auth/Register",
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from(RegisterRequest.encode(value).finish()),
        requestDeserialize: (value) => RegisterRequest.decode(value),
        responseSerialize: (value) => Buffer.from(RegisterResponse.encode(value).finish()),
        responseDeserialize: (value) => RegisterResponse.decode(value),
    },
    login: {
        path: "/soo.auth.Auth/Login",
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from(LoginRequest.encode(value).finish()),
        requestDeserialize: (value) => LoginRequest.decode(value),
        responseSerialize: (value) => Buffer.from(LoginResponse.encode(value).finish()),
        responseDeserialize: (value) => LoginResponse.decode(value),
    },
    refresh: {
        path: "/soo.auth.Auth/Refresh",
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from(RefreshRequest.encode(value).finish()),
        requestDeserialize: (value) => RefreshRequest.decode(value),
        responseSerialize: (value) => Buffer.from(RefreshResponse.encode(value).finish()),
        responseDeserialize: (value) => RefreshResponse.decode(value),
    },
    verify: {
        path: "/soo.auth.Auth/Verify",
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from(VerifyRequest.encode(value).finish()),
        requestDeserialize: (value) => VerifyRequest.decode(value),
        responseSerialize: (value) => Buffer.from(VerifyResponse.encode(value).finish()),
        responseDeserialize: (value) => VerifyResponse.decode(value),
    },
};
export const AuthClient = makeGenericClientConstructor(AuthService, "soo.auth.Auth");
function longToNumber(int64) {
    const num = globalThis.Number(int64.toString());
    if (num > globalThis.Number.MAX_SAFE_INTEGER) {
        throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
    }
    if (num < globalThis.Number.MIN_SAFE_INTEGER) {
        throw new globalThis.Error("Value is smaller than Number.MIN_SAFE_INTEGER");
    }
    return num;
}
function isSet(value) {
    return value !== null && value !== undefined;
}
