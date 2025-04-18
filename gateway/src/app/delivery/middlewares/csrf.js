import * as crypto from '#lib/crypto/index.js';
import { render } from '#lib/ejs/render.js';
import { requestCookies } from '#lib/rest/cookie.js';

export class CSRFMiddlewares {
    /** @type {import('#shared/logger').Logger} */
    #logger;

    /**
     * @param {import('#shared/logger').Logger} logger
     */
    constructor(logger) {
        this.#logger = logger;
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {void}
     */
    withCSRF(req, res, next) {
        try {
            const csrfCookie = requestCookies(req).csrfToken;
            if (csrfCookie) {
                throw csrfCookie;
            }

            this.#logger.debug({}, 'Generating new CSRF token');
            const csrfToken = crypto.randomString(32);
            res.cookie('csrfToken', csrfToken, {
                httpOnly: true,
                sameSite: 'strict',
            });
            throw csrfToken;
        } catch (err) {
            if (typeof err !== 'string') {
                throw err;
            }
            res.locals.csrfToken = err;
        } finally {
            return void next();
        }
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {void}
     */
    verifyCsrfToken(req, res, next) {
        const csrfCookie = requestCookies(req).csrfToken;
        const csrfTarget = this.#getCSRFTokenFromRequest(req);

        if (csrfCookie !== csrfTarget) {
            this.#logger.warn(
                { csrfCookie, csrfTarget },
                'CSRF token mismatch',
            );

            return void render(res)
                .template('components/toast.oob', {
                    initiator: 'Security',
                    message: 'CSRF token mismatch',
                    variant: 'danger',
                })
                .exec();
        }

        next();
    }

    /**
     * @param {import('express').Request} req
     * @returns {string | null}
     */
    #getCSRFTokenFromRequest(req) {
        if (req.method === 'POST' && req.body?.csrfToken) {
            return req.body.csrfToken;
        }

        const tokenHeader = req.headers['x-csrf-token'];
        if (!tokenHeader) {
            return null;
        }

        return Array.isArray(tokenHeader) ? tokenHeader[0] : tokenHeader;
    }
}
