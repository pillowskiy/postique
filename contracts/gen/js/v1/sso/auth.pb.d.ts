import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { type CallOptions, ChannelCredentials, Client, type ClientOptions, type ClientUnaryCall, type handleUnaryCall, Metadata, type ServiceError, type UntypedServiceImplementation } from "@grpc/grpc-js";
export declare const protobufPackage = "soo.auth";
export interface RegisterRequest {
    email: string;
    password: string;
    username?: string | undefined;
}
export interface RegisterResponse {
    userId: string;
}
export interface LoginRequest {
    email: string;
    password: string;
    appName: string;
}
export interface LoginResponse {
    session: Session | undefined;
}
export interface RefreshRequest {
    token: string;
    appName: string;
}
export interface RefreshResponse {
    session: Session | undefined;
}
export interface Session {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
}
export interface VerifyRequest {
}
export interface VerifyResponse {
    userId: string;
    username: string;
    avatarPath: string;
}
export declare const RegisterRequest: MessageFns<RegisterRequest>;
export declare const RegisterResponse: MessageFns<RegisterResponse>;
export declare const LoginRequest: MessageFns<LoginRequest>;
export declare const LoginResponse: MessageFns<LoginResponse>;
export declare const RefreshRequest: MessageFns<RefreshRequest>;
export declare const RefreshResponse: MessageFns<RefreshResponse>;
export declare const Session: MessageFns<Session>;
export declare const VerifyRequest: MessageFns<VerifyRequest>;
export declare const VerifyResponse: MessageFns<VerifyResponse>;
export type AuthService = typeof AuthService;
export declare const AuthService: {
    readonly register: {
        readonly path: "/soo.auth.Auth/Register";
        readonly requestStream: false;
        readonly responseStream: false;
        readonly requestSerialize: (value: RegisterRequest) => Buffer<ArrayBuffer>;
        readonly requestDeserialize: (value: Buffer) => RegisterRequest;
        readonly responseSerialize: (value: RegisterResponse) => Buffer<ArrayBuffer>;
        readonly responseDeserialize: (value: Buffer) => RegisterResponse;
    };
    readonly login: {
        readonly path: "/soo.auth.Auth/Login";
        readonly requestStream: false;
        readonly responseStream: false;
        readonly requestSerialize: (value: LoginRequest) => Buffer<ArrayBuffer>;
        readonly requestDeserialize: (value: Buffer) => LoginRequest;
        readonly responseSerialize: (value: LoginResponse) => Buffer<ArrayBuffer>;
        readonly responseDeserialize: (value: Buffer) => LoginResponse;
    };
    readonly refresh: {
        readonly path: "/soo.auth.Auth/Refresh";
        readonly requestStream: false;
        readonly responseStream: false;
        readonly requestSerialize: (value: RefreshRequest) => Buffer<ArrayBuffer>;
        readonly requestDeserialize: (value: Buffer) => RefreshRequest;
        readonly responseSerialize: (value: RefreshResponse) => Buffer<ArrayBuffer>;
        readonly responseDeserialize: (value: Buffer) => RefreshResponse;
    };
    readonly verify: {
        readonly path: "/soo.auth.Auth/Verify";
        readonly requestStream: false;
        readonly responseStream: false;
        readonly requestSerialize: (value: VerifyRequest) => Buffer<ArrayBuffer>;
        readonly requestDeserialize: (value: Buffer) => VerifyRequest;
        readonly responseSerialize: (value: VerifyResponse) => Buffer<ArrayBuffer>;
        readonly responseDeserialize: (value: Buffer) => VerifyResponse;
    };
};
export interface AuthServer extends UntypedServiceImplementation {
    register: handleUnaryCall<RegisterRequest, RegisterResponse>;
    login: handleUnaryCall<LoginRequest, LoginResponse>;
    refresh: handleUnaryCall<RefreshRequest, RefreshResponse>;
    verify: handleUnaryCall<VerifyRequest, VerifyResponse>;
}
export interface AuthClient extends Client {
    register(request: RegisterRequest, callback: (error: ServiceError | null, response: RegisterResponse) => void): ClientUnaryCall;
    register(request: RegisterRequest, metadata: Metadata, callback: (error: ServiceError | null, response: RegisterResponse) => void): ClientUnaryCall;
    register(request: RegisterRequest, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: RegisterResponse) => void): ClientUnaryCall;
    login(request: LoginRequest, callback: (error: ServiceError | null, response: LoginResponse) => void): ClientUnaryCall;
    login(request: LoginRequest, metadata: Metadata, callback: (error: ServiceError | null, response: LoginResponse) => void): ClientUnaryCall;
    login(request: LoginRequest, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: LoginResponse) => void): ClientUnaryCall;
    refresh(request: RefreshRequest, callback: (error: ServiceError | null, response: RefreshResponse) => void): ClientUnaryCall;
    refresh(request: RefreshRequest, metadata: Metadata, callback: (error: ServiceError | null, response: RefreshResponse) => void): ClientUnaryCall;
    refresh(request: RefreshRequest, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: RefreshResponse) => void): ClientUnaryCall;
    verify(request: VerifyRequest, callback: (error: ServiceError | null, response: VerifyResponse) => void): ClientUnaryCall;
    verify(request: VerifyRequest, metadata: Metadata, callback: (error: ServiceError | null, response: VerifyResponse) => void): ClientUnaryCall;
    verify(request: VerifyRequest, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: VerifyResponse) => void): ClientUnaryCall;
}
export declare const AuthClient: {
    new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): AuthClient;
    service: typeof AuthService;
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
