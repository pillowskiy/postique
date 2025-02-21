import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { type CallOptions, ChannelCredentials, Client, type ClientOptions, type ClientUnaryCall, type handleUnaryCall, Metadata, type ServiceError, type UntypedServiceImplementation } from "@grpc/grpc-js";
export declare const protobufPackage = "permission";
export interface HasPermissionRequest {
    name: string;
}
export interface HasPermissionResponse {
    hasPermission: boolean;
}
export interface HasUserPermissionRequest {
    userId: string;
    name: string;
}
export interface HasUserPermissionResponse {
    hasPermission: boolean;
}
export declare const HasPermissionRequest: MessageFns<HasPermissionRequest>;
export declare const HasPermissionResponse: MessageFns<HasPermissionResponse>;
export declare const HasUserPermissionRequest: MessageFns<HasUserPermissionRequest>;
export declare const HasUserPermissionResponse: MessageFns<HasUserPermissionResponse>;
export type PermissionService = typeof PermissionService;
export declare const PermissionService: {
    readonly hasPermission: {
        readonly path: "/permission.Permission/HasPermission";
        readonly requestStream: false;
        readonly responseStream: false;
        readonly requestSerialize: (value: HasPermissionRequest) => Buffer<ArrayBuffer>;
        readonly requestDeserialize: (value: Buffer) => HasPermissionRequest;
        readonly responseSerialize: (value: HasPermissionResponse) => Buffer<ArrayBuffer>;
        readonly responseDeserialize: (value: Buffer) => HasPermissionResponse;
    };
    readonly hasUserPermission: {
        readonly path: "/permission.Permission/HasUserPermission";
        readonly requestStream: false;
        readonly responseStream: false;
        readonly requestSerialize: (value: HasUserPermissionRequest) => Buffer<ArrayBuffer>;
        readonly requestDeserialize: (value: Buffer) => HasUserPermissionRequest;
        readonly responseSerialize: (value: HasUserPermissionResponse) => Buffer<ArrayBuffer>;
        readonly responseDeserialize: (value: Buffer) => HasUserPermissionResponse;
    };
};
export interface PermissionServer extends UntypedServiceImplementation {
    hasPermission: handleUnaryCall<HasPermissionRequest, HasPermissionResponse>;
    hasUserPermission: handleUnaryCall<HasUserPermissionRequest, HasUserPermissionResponse>;
}
export interface PermissionClient extends Client {
    hasPermission(request: HasPermissionRequest, callback: (error: ServiceError | null, response: HasPermissionResponse) => void): ClientUnaryCall;
    hasPermission(request: HasPermissionRequest, metadata: Metadata, callback: (error: ServiceError | null, response: HasPermissionResponse) => void): ClientUnaryCall;
    hasPermission(request: HasPermissionRequest, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: HasPermissionResponse) => void): ClientUnaryCall;
    hasUserPermission(request: HasUserPermissionRequest, callback: (error: ServiceError | null, response: HasUserPermissionResponse) => void): ClientUnaryCall;
    hasUserPermission(request: HasUserPermissionRequest, metadata: Metadata, callback: (error: ServiceError | null, response: HasUserPermissionResponse) => void): ClientUnaryCall;
    hasUserPermission(request: HasUserPermissionRequest, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: HasUserPermissionResponse) => void): ClientUnaryCall;
}
export declare const PermissionClient: {
    new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): PermissionClient;
    service: typeof PermissionService;
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
