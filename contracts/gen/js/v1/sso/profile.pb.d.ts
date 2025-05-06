import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { type CallOptions, ChannelCredentials, Client, type ClientOptions, type ClientUnaryCall, type handleUnaryCall, Metadata, type ServiceError, type UntypedServiceImplementation } from "@grpc/grpc-js";
export declare const protobufPackage = "sso.profile";
export interface UpdateProfileRequest {
    userId: string;
    username?: string | undefined;
    avatarPath?: string | undefined;
    bio?: string | undefined;
}
export interface UpdateProfileResponse {
    profile: UserProfile | undefined;
}
export interface GetProfileRequest {
    username: string;
}
export interface GetProfileResponse {
    userId: string;
    profile: UserProfile | undefined;
}
export interface UserProfile {
    username: string;
    avatarPath: string;
    bio: string;
}
export declare const UpdateProfileRequest: MessageFns<UpdateProfileRequest>;
export declare const UpdateProfileResponse: MessageFns<UpdateProfileResponse>;
export declare const GetProfileRequest: MessageFns<GetProfileRequest>;
export declare const GetProfileResponse: MessageFns<GetProfileResponse>;
export declare const UserProfile: MessageFns<UserProfile>;
export type ProfileService = typeof ProfileService;
export declare const ProfileService: {
    readonly updateProfile: {
        readonly path: "/sso.profile.Profile/UpdateProfile";
        readonly requestStream: false;
        readonly responseStream: false;
        readonly requestSerialize: (value: UpdateProfileRequest) => Buffer<ArrayBuffer>;
        readonly requestDeserialize: (value: Buffer) => UpdateProfileRequest;
        readonly responseSerialize: (value: UpdateProfileResponse) => Buffer<ArrayBuffer>;
        readonly responseDeserialize: (value: Buffer) => UpdateProfileResponse;
    };
    readonly getProfile: {
        readonly path: "/sso.profile.Profile/GetProfile";
        readonly requestStream: false;
        readonly responseStream: false;
        readonly requestSerialize: (value: GetProfileRequest) => Buffer<ArrayBuffer>;
        readonly requestDeserialize: (value: Buffer) => GetProfileRequest;
        readonly responseSerialize: (value: GetProfileResponse) => Buffer<ArrayBuffer>;
        readonly responseDeserialize: (value: Buffer) => GetProfileResponse;
    };
};
export interface ProfileServer extends UntypedServiceImplementation {
    updateProfile: handleUnaryCall<UpdateProfileRequest, UpdateProfileResponse>;
    getProfile: handleUnaryCall<GetProfileRequest, GetProfileResponse>;
}
export interface ProfileClient extends Client {
    updateProfile(request: UpdateProfileRequest, callback: (error: ServiceError | null, response: UpdateProfileResponse) => void): ClientUnaryCall;
    updateProfile(request: UpdateProfileRequest, metadata: Metadata, callback: (error: ServiceError | null, response: UpdateProfileResponse) => void): ClientUnaryCall;
    updateProfile(request: UpdateProfileRequest, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: UpdateProfileResponse) => void): ClientUnaryCall;
    getProfile(request: GetProfileRequest, callback: (error: ServiceError | null, response: GetProfileResponse) => void): ClientUnaryCall;
    getProfile(request: GetProfileRequest, metadata: Metadata, callback: (error: ServiceError | null, response: GetProfileResponse) => void): ClientUnaryCall;
    getProfile(request: GetProfileRequest, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: GetProfileResponse) => void): ClientUnaryCall;
}
export declare const ProfileClient: {
    new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): ProfileClient;
    service: typeof ProfileService;
    serviceName: string;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
    fromJSON(object: any): T;
    toJSON(message: T): unknown;
    create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
    fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
export {};
