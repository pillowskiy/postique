import { ServiceError, ServiceErrorCodes } from '#app/services/error.js';

const serviceToHttpErrorCodes = /** @type {const} */ Object.freeze({
    [ServiceErrorCodes.Canceled]: 499,
    [ServiceErrorCodes.Unknown]: 500,
    [ServiceErrorCodes.InvalidArgument]: 400,
    [ServiceErrorCodes.DeadlineExceeded]: 504,
    [ServiceErrorCodes.NotFound]: 404,
    [ServiceErrorCodes.AlreadyExists]: 409,
    [ServiceErrorCodes.PermissionDenied]: 403,
    [ServiceErrorCodes.ResourceExhausted]: 429,
    [ServiceErrorCodes.FailedPrecondition]: 400,
    [ServiceErrorCodes.Aborted]: 409,
    [ServiceErrorCodes.OutOfRange]: 400,
    [ServiceErrorCodes.Unimplemented]: 501,
    [ServiceErrorCodes.Internal]: 500,
    [ServiceErrorCodes.Unavailable]: 503,
    [ServiceErrorCodes.DataLoss]: 500,
    [ServiceErrorCodes.Unauthenticated]: 401,
});

export class ClientException extends Error {
    /**
     * @param {unknown} err
     * @returns {ClientException}
     */
    static fromError(err) {
        if (err instanceof ClientException) {
            return err;
        }
        return ClientException.fromServiceError(err);
    }

    /**
     * @param {unknown} err
     * @returns {ClientException}
     */
    static fromServiceError(err) {
        if (err instanceof ServiceError) {
            return new ClientException(
                err.message,
                serviceToHttpErrorCodes[err.code],
                err.details,
            );
        }
        return new ClientException('Internal server error occurred', 500);
    }

    /**
     * @param {string} message
     * @param {number} status
     * @param {object} details
     */
    constructor(message, status, details = {}) {
        super(message);
        this.message = message;
        this.status = status;
        this.details = details;
    }
}
