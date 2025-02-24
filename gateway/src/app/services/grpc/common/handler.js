/* eslint-disable no-underscore-dangle */
// @ts-nocheck
import { Metadata } from '@postique/pb/grpc';

export default class GRPCHandler {
    _client;

    constructor(client) {
        this._client = client;
    }

    async call(method, request, metadata = new Metadata(), options = {}) {
        const fn = this._client[method];
        if (typeof fn !== 'function') {
            throw new Error(`Method ${method} not found`);
        }
        return new Promise((resolve, reject) => {
            this._client[method](
                request,
                metadata,
                options,
                (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response);
                    }
                },
            );
        });
    }
}
