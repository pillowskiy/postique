import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { type CallOptions, ChannelCredentials, Client, type ClientOptions, type ClientUnaryCall, type handleUnaryCall, Metadata, type ServiceError, type UntypedServiceImplementation } from "@grpc/grpc-js";
export declare const protobufPackage = "files.file";
export interface UploadRequest {
    data: Uint8Array;
    filename: string;
    contentType: string;
}
export interface UploadResponse {
    path: string;
}
export interface DeleteRequest {
    path: string;
}
export interface DeleteResponse {
    path: string;
}
export declare const UploadRequest: MessageFns<UploadRequest>;
export declare const UploadResponse: MessageFns<UploadResponse>;
export declare const DeleteRequest: MessageFns<DeleteRequest>;
export declare const DeleteResponse: MessageFns<DeleteResponse>;
export type FileService = typeof FileService;
export declare const FileService: {
    readonly upload: {
        readonly path: "/files.file.File/Upload";
        readonly requestStream: false;
        readonly responseStream: false;
        readonly requestSerialize: (value: UploadRequest) => Buffer<ArrayBuffer>;
        readonly requestDeserialize: (value: Buffer) => UploadRequest;
        readonly responseSerialize: (value: UploadResponse) => Buffer<ArrayBuffer>;
        readonly responseDeserialize: (value: Buffer) => UploadResponse;
    };
    readonly delete: {
        readonly path: "/files.file.File/Delete";
        readonly requestStream: false;
        readonly responseStream: false;
        readonly requestSerialize: (value: DeleteRequest) => Buffer<ArrayBuffer>;
        readonly requestDeserialize: (value: Buffer) => DeleteRequest;
        readonly responseSerialize: (value: DeleteResponse) => Buffer<ArrayBuffer>;
        readonly responseDeserialize: (value: Buffer) => DeleteResponse;
    };
};
export interface FileServer extends UntypedServiceImplementation {
    upload: handleUnaryCall<UploadRequest, UploadResponse>;
    delete: handleUnaryCall<DeleteRequest, DeleteResponse>;
}
export interface FileClient extends Client {
    upload(request: UploadRequest, callback: (error: ServiceError | null, response: UploadResponse) => void): ClientUnaryCall;
    upload(request: UploadRequest, metadata: Metadata, callback: (error: ServiceError | null, response: UploadResponse) => void): ClientUnaryCall;
    upload(request: UploadRequest, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: UploadResponse) => void): ClientUnaryCall;
    delete(request: DeleteRequest, callback: (error: ServiceError | null, response: DeleteResponse) => void): ClientUnaryCall;
    delete(request: DeleteRequest, metadata: Metadata, callback: (error: ServiceError | null, response: DeleteResponse) => void): ClientUnaryCall;
    delete(request: DeleteRequest, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: DeleteResponse) => void): ClientUnaryCall;
}
export declare const FileClient: {
    new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): FileClient;
    service: typeof FileService;
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
