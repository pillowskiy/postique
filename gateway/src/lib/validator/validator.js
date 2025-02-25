import { validationResult } from 'express-validator';

/**
 * @param {import('express').Request} req
 * @returns {{ isEmpty: () => boolean, mapped: () => object }}
 */
export function validate(req) {
    return validationResult(req).formatWith(({ msg }) => msg);
}
