import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { type CallOptions, ChannelCredentials, Client, type ClientOptions, type ClientUnaryCall, type handleUnaryCall, Metadata, type ServiceError, type UntypedServiceImplementation } from "@grpc/grpc-js";
export declare const protobufPackage = "files.app";
export interface CreateAppRequest {
    name: string;
    bucket: string;
}
export interface CreateAppResponse {
    token: string;
}
export declare const CreateAppRequest: MessageFns<CreateAppRequest>;
export declare const CreateAppResponse: MessageFns<CreateAppResponse>;
export type AppService = typeof AppService;
export declare const AppService: {
    readonly createApp: {
        readonly path: "/files.app.App/CreateApp";
        readonly requestStream: false;
        readonly responseStream: false;
        readonly requestSerialize: (value: CreateAppRequest) => Buffer<ArrayBuffer>;
        readonly requestDeserialize: (value: Buffer) => CreateAppRequest;
        readonly responseSerialize: (value: CreateAppResponse) => Buffer<ArrayBuffer>;
        readonly responseDeserialize: (value: Buffer) => CreateAppResponse;
    };
};
export interface AppServer extends UntypedServiceImplementation {
    createApp: handleUnaryCall<CreateAppRequest, CreateAppResponse>;
}
export interface AppClient extends Client {
    createApp(request: CreateAppRequest, callback: (error: ServiceError | null, response: CreateAppResponse) => void): ClientUnaryCall;
    createApp(request: CreateAppRequest, metadata: Metadata, callback: (error: ServiceError | null, response: CreateAppResponse) => void): ClientUnaryCall;
    createApp(request: CreateAppRequest, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: CreateAppResponse) => void): ClientUnaryCall;
}
export declare const AppClient: {
    new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): AppClient;
    service: typeof AppService;
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
