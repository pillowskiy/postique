/* eslint-disable no-underscore-dangle */
// @ts-nocheck
import { ServiceError, ServiceErrorCodes } from '#app/services/error.js';

import { Metadata, status } from '@postique/pb/grpc';

const grpcToServiceErrorCodeMap /** @type {const} */ = Object.freeze({
    [status.CANCELLED]: ServiceErrorCodes.Canceled,
    [status.UNKNOWN]: ServiceErrorCodes.Unknown,
    [status.INVALID_ARGUMENT]: ServiceErrorCodes.InvalidArgument,
    [status.DEADLINE_EXCEEDED]: ServiceErrorCodes.DeadlineExceeded,
    [status.NOT_FOUND]: ServiceErrorCodes.NotFound,
    [status.ALREADY_EXISTS]: ServiceErrorCodes.AlreadyExists,
    [status.PERMISSION_DENIED]: ServiceErrorCodes.PermissionDenied,
    [status.RESOURCE_EXHAUSTED]: ServiceErrorCodes.ResourceExhausted,
    [status.FAILED_PRECONDITION]: ServiceErrorCodes.FailedPrecondition,
    [status.ABORTED]: ServiceErrorCodes.Aborted,
    [status.OUT_OF_RANGE]: ServiceErrorCodes.OutOfRange,
    [status.UNIMPLEMENTED]: ServiceErrorCodes.Unimplemented,
    [status.INTERNAL]: ServiceErrorCodes.Internal,
    [status.UNAVAILABLE]: ServiceErrorCodes.Unavailable,
    [status.DATA_LOSS]: ServiceErrorCodes.DataLoss,
    [status.UNAUTHENTICATED]: ServiceErrorCodes.Unauthenticated,
});

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
                /**
                 * @param {import('@postique/pb/grpc').ServiceError} err
                 */
                (err, response) => {
                    if (err) {
                        reject(
                            new ServiceError(
                                err.details,
                                grpcToServiceErrorCodeMap[err.code],
                            ),
                        );

                        reject(err);
                    } else {
                        resolve(response);
                    }
                },
            );
        });
    }
}
