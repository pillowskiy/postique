import { ServiceError, ServiceErrorCodes } from '#app/services/error.js';

import ky from 'ky';

const restToServiceErrorCodeMap = /** @type {const} */ Object.freeze({
    400: ServiceErrorCodes.InvalidArgument,
    401: ServiceErrorCodes.Unauthenticated,
    403: ServiceErrorCodes.PermissionDenied,
    404: ServiceErrorCodes.NotFound,
    409: ServiceErrorCodes.Aborted,
    412: ServiceErrorCodes.FailedPrecondition,
    413: ServiceErrorCodes.ResourceExhausted, // payload too large
    429: ServiceErrorCodes.ResourceExhausted, // too many requests
    499: ServiceErrorCodes.Canceled, // client closed request
    500: ServiceErrorCodes.Internal,
    501: ServiceErrorCodes.Unimplemented,
    503: ServiceErrorCodes.Unavailable,
    504: ServiceErrorCodes.DeadlineExceeded,
});

export class RestClient {
    /** @type {import('ky').KyInstance} */
    _client;

    /**
     * @param {string} prefixUrl
     * @param {number} [timeout]
     */
    constructor(prefixUrl, timeout) {
        this._createInstance(prefixUrl, timeout);
    }

    /**
     * @param {string} prefixUrl
     * @param {number} [timeout]
     */
    _createInstance(prefixUrl, timeout = 5000) {
        this._client = ky.create({
            prefixUrl,
            timeout,
            hooks: {
                beforeRequest: [
                    async (req, opts) => {
                        console.log(`Request ${req.method} to ${req.url}`);
                        if (req.method !== 'GET' && opts.headers) {
                            opts.headers['Content-Type'] ??= 'application/json';
                        }
                    },
                ],
                afterResponse: [
                    async (req, __, res) => {
                        if (res.ok) {
                            return;
                        }

                        const data = await res.json();
                        let message = '',
                            details = {};

                        if (typeof data === 'string') {
                            message = data;
                        } else if (typeof data === 'object' && data !== null) {
                            if ('message' in data) {
                                // @ts-expect-error
                                message = data.message.toString();
                            }

                            if (
                                'details' in data &&
                                typeof data.details === 'object' &&
                                data.details !== null
                            ) {
                                details = data.details;
                            } else if (
                                'errors' in data &&
                                typeof data.errors === 'object' &&
                                data.errors !== null
                            ) {
                                details = data.errors;
                            }
                        } else {
                            message = 'Internal server error occurred';
                        }

                        throw new ServiceError(
                            message + `- At ${req.url}`,
                            restToServiceErrorCodeMap[res.status],
                            details,
                        );
                    },
                ],
            },
        });
    }

    /**
     * @param {string | null} auth
     * @param {Object} headers
     * @returns {Object}
     */
    _withAuth(auth, headers = {}) {
        if (!auth) return headers;

        return {
            ...headers,
            Authorization: `Bearer ${auth}`,
        };
    }
}
