import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { makeGenericClientConstructor, } from "@grpc/grpc-js";
export const protobufPackage = "sso.profile";
function createBaseGetProfileRequest() {
    return { username: "" };
}
export const GetProfileRequest = {
    encode(message, writer = new BinaryWriter()) {
        if (message.username !== "") {
            writer.uint32(10).string(message.username);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetProfileRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 10) {
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
        return { username: isSet(object.username) ? globalThis.String(object.username) : "" };
    },
    toJSON(message) {
        const obj = {};
        if (message.username !== "") {
            obj.username = message.username;
        }
        return obj;
    },
    create(base) {
        return GetProfileRequest.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseGetProfileRequest();
        message.username = object.username ?? "";
        return message;
    },
};
function createBaseGetProfileResponse() {
    return { profile: undefined };
}
export const GetProfileResponse = {
    encode(message, writer = new BinaryWriter()) {
        if (message.profile !== undefined) {
            UserProfile.encode(message.profile, writer.uint32(10).fork()).join();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetProfileResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 10) {
                        break;
                    }
                    message.profile = UserProfile.decode(reader, reader.uint32());
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
        return { profile: isSet(object.profile) ? UserProfile.fromJSON(object.profile) : undefined };
    },
    toJSON(message) {
        const obj = {};
        if (message.profile !== undefined) {
            obj.profile = UserProfile.toJSON(message.profile);
        }
        return obj;
    },
    create(base) {
        return GetProfileResponse.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseGetProfileResponse();
        message.profile = (object.profile !== undefined && object.profile !== null)
            ? UserProfile.fromPartial(object.profile)
            : undefined;
        return message;
    },
};
function createBaseUpdateProfileRequest() {
    return { userId: "" };
}
export const UpdateProfileRequest = {
    encode(message, writer = new BinaryWriter()) {
        if (message.userId !== "") {
            writer.uint32(10).string(message.userId);
        }
        if (message.username !== undefined) {
            writer.uint32(18).string(message.username);
        }
        if (message.avatarPath !== undefined) {
            writer.uint32(26).string(message.avatarPath);
        }
        if (message.bio !== undefined) {
            writer.uint32(34).string(message.bio);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseUpdateProfileRequest();
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
                case 4: {
                    if (tag !== 34) {
                        break;
                    }
                    message.bio = reader.string();
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
            username: isSet(object.username) ? globalThis.String(object.username) : undefined,
            avatarPath: isSet(object.avatarPath) ? globalThis.String(object.avatarPath) : undefined,
            bio: isSet(object.bio) ? globalThis.String(object.bio) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.userId !== "") {
            obj.userId = message.userId;
        }
        if (message.username !== undefined) {
            obj.username = message.username;
        }
        if (message.avatarPath !== undefined) {
            obj.avatarPath = message.avatarPath;
        }
        if (message.bio !== undefined) {
            obj.bio = message.bio;
        }
        return obj;
    },
    create(base) {
        return UpdateProfileRequest.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseUpdateProfileRequest();
        message.userId = object.userId ?? "";
        message.username = object.username ?? undefined;
        message.avatarPath = object.avatarPath ?? undefined;
        message.bio = object.bio ?? undefined;
        return message;
    },
};
function createBaseUpdateProfileResponse() {
    return { profile: undefined };
}
export const UpdateProfileResponse = {
    encode(message, writer = new BinaryWriter()) {
        if (message.profile !== undefined) {
            UserProfile.encode(message.profile, writer.uint32(10).fork()).join();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseUpdateProfileResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 10) {
                        break;
                    }
                    message.profile = UserProfile.decode(reader, reader.uint32());
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
        return { profile: isSet(object.profile) ? UserProfile.fromJSON(object.profile) : undefined };
    },
    toJSON(message) {
        const obj = {};
        if (message.profile !== undefined) {
            obj.profile = UserProfile.toJSON(message.profile);
        }
        return obj;
    },
    create(base) {
        return UpdateProfileResponse.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseUpdateProfileResponse();
        message.profile = (object.profile !== undefined && object.profile !== null)
            ? UserProfile.fromPartial(object.profile)
            : undefined;
        return message;
    },
};
function createBaseUserProfile() {
    return { username: "", avatarPath: "", bio: "" };
}
export const UserProfile = {
    encode(message, writer = new BinaryWriter()) {
        if (message.username !== "") {
            writer.uint32(10).string(message.username);
        }
        if (message.avatarPath !== "") {
            writer.uint32(18).string(message.avatarPath);
        }
        if (message.bio !== "") {
            writer.uint32(26).string(message.bio);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseUserProfile();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 10) {
                        break;
                    }
                    message.username = reader.string();
                    continue;
                }
                case 2: {
                    if (tag !== 18) {
                        break;
                    }
                    message.avatarPath = reader.string();
                    continue;
                }
                case 3: {
                    if (tag !== 26) {
                        break;
                    }
                    message.bio = reader.string();
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
            username: isSet(object.username) ? globalThis.String(object.username) : "",
            avatarPath: isSet(object.avatarPath) ? globalThis.String(object.avatarPath) : "",
            bio: isSet(object.bio) ? globalThis.String(object.bio) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.username !== "") {
            obj.username = message.username;
        }
        if (message.avatarPath !== "") {
            obj.avatarPath = message.avatarPath;
        }
        if (message.bio !== "") {
            obj.bio = message.bio;
        }
        return obj;
    },
    create(base) {
        return UserProfile.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseUserProfile();
        message.username = object.username ?? "";
        message.avatarPath = object.avatarPath ?? "";
        message.bio = object.bio ?? "";
        return message;
    },
};
export const ProfileService = {
    getProfile: {
        path: "/sso.profile.Profile/GetProfile",
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from(GetProfileRequest.encode(value).finish()),
        requestDeserialize: (value) => GetProfileRequest.decode(value),
        responseSerialize: (value) => Buffer.from(GetProfileResponse.encode(value).finish()),
        responseDeserialize: (value) => GetProfileResponse.decode(value),
    },
    updateProfile: {
        path: "/sso.profile.Profile/UpdateProfile",
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from(UpdateProfileRequest.encode(value).finish()),
        requestDeserialize: (value) => UpdateProfileRequest.decode(value),
        responseSerialize: (value) => Buffer.from(UpdateProfileResponse.encode(value).finish()),
        responseDeserialize: (value) => UpdateProfileResponse.decode(value),
    },
};
export const ProfileClient = makeGenericClientConstructor(ProfileService, "sso.profile.Profile");
function isSet(value) {
    return value !== null && value !== undefined;
}
