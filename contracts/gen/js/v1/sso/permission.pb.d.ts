import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
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
export interface Permission {
    HasPermission(request: HasPermissionRequest): Promise<HasPermissionResponse>;
    HasUserPermission(request: HasUserPermissionRequest): Promise<HasUserPermissionResponse>;
}
export declare const PermissionServiceName = "permission.Permission";
export declare class PermissionClientImpl implements Permission {
    private readonly rpc;
    private readonly service;
    constructor(rpc: Rpc, opts?: {
        service?: string;
    });
    HasPermission(request: HasPermissionRequest): Promise<HasPermissionResponse>;
    HasUserPermission(request: HasUserPermissionRequest): Promise<HasUserPermissionResponse>;
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
