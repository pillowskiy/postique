import crypto from 'crypto';

/**
 * @param {number} length
 * @returns {string}
 */
export function randomString(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}
