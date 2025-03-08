import { parse } from 'cookie';

/**
 * @param {import('express').Request} req
 * @returns {Record<string,string | undefined>}
 */
export function requestCookies(req) {
    const cookies = req.headers.cookie;
    if (!cookies) {
        return {};
    }

    return parse(cookies);
}
