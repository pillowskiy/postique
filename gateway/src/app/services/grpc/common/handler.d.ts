import type { CallOptions, Client, Metadata } from '@postique/pb/grpc';

export type CB = (...args: any[]) => any;

export type RemoveCallbackParam<T extends CB> = T extends (
    ...args: infer P
) => infer R
    ? P extends [...infer Rest, infer Last]
        ? Last extends (...args: any) => any
            ? Rest
            : P
        : P
    : never;

export type ExtractCallbackParams<T extends CB> = T extends (
    ...args: [...infer _, infer Last]
) => any
    ? Last extends (...args: infer CallbackParams) => any
        ? CallbackParams
        : never
    : never;

type ExtractResponseType<T extends CB> = T extends (
    ...args: [any, infer Error, infer Response]
) => void
    ? Response // This will return the RegisterResponse type
    : never;

export default class GRPCHandler<T extends Client> {
    protected _client: T;

    constructor(client: T);

    call<
        M extends keyof Omit<T, keyof Client> & string,
        FN extends T[M] extends (...args: any[]) => any ? T[M] : never,
    >(
        method: M,
        request: RemoveCallbackParam<FN>[0],
        metadata?: Metadata,
        options?: CallOptions,
    ): Promise<ExtractCallbackParams<FN>[1]>;
}
