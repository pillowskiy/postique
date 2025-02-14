import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
export declare const protobufPackage = "auth";
export interface RegisterRequest {
    email: string;
    password: string;
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
export interface Auth {
    Register(request: RegisterRequest): Promise<RegisterResponse>;
    Login(request: LoginRequest): Promise<LoginResponse>;
    Refresh(request: RefreshRequest): Promise<RefreshResponse>;
    Verify(request: VerifyRequest): Promise<VerifyResponse>;
}
export declare const AuthServiceName = "auth.Auth";
export declare class AuthClientImpl implements Auth {
    private readonly rpc;
    private readonly service;
    constructor(rpc: Rpc, opts?: {
        service?: string;
    });
    Register(request: RegisterRequest): Promise<RegisterResponse>;
    Login(request: LoginRequest): Promise<LoginResponse>;
    Refresh(request: RefreshRequest): Promise<RefreshResponse>;
    Verify(request: VerifyRequest): Promise<VerifyResponse>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
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
