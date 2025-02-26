/* eslint-disable max-classes-per-file */
export const ServiceErrorCodes /** @type {const} */ = Object.freeze({
    Canceled: 1,
    Unknown: 2,
    InvalidArgument: 3,
    DeadlineExceeded: 4,
    NotFound: 5,
    AlreadyExists: 6,
    PermissionDenied: 7,
    ResourceExhausted: 8,
    FailedPrecondition: 9,
    Aborted: 10,
    OutOfRange: 11,
    Unimplemented: 12,
    Internal: 13,
    Unavailable: 14,
    DataLoss: 15,
    Unauthenticated: 16,
});

export class ServiceError extends Error {
    /**
     * @param {string} message
     * @param {typeof ServiceErrorCodes[keyof typeof ServiceErrorCodes]} code
     * @param {object} details
     */
    constructor(message, code, details = {}) {
        super(message);

        /** @type {number} */
        this.code = code;
        /** @type {object} */
        this.details = details;
    }
}
