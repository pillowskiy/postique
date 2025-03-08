/** @typedef{import("#shared/logger").Logger} Logger */
/** @typedef{import("#app/services").AuthService} AuthService */
import { ClientException } from '#app/common/error.js';
import { requestCookies } from '#lib/rest/cookie.js';

export class AuthMiddlewares {
    /** @type {Logger} */
    #logger;

    /** @type {AuthService} */
    #authService;

    /**
     * @param {Logger} logger
     * @param {AuthService} authService
     */
    constructor(logger, authService) {
        this.#logger = logger;
        this.#authService = authService;
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} _
     * @param {import('express').NextFunction} next
     */
    async withAuth(req, _, next) {
        const accessToken = this.#tokenFromCookie(req);
        if (!accessToken) {
            return void next(
                new ClientException(
                    'Only authorizied users can access this resource',
                    401,
                ),
            );
        }

        try {
            const user = await this.#authService.verify(accessToken);
            this.#logger.info({ user }, 'User successfully verified');
            req.user = user;
        } catch (err) {
            this.#logger.error({ ...err }, 'Failed to verify access token');
            return void next(
                new ClientException(
                    'Only authorizied users can access this resource',
                    401,
                ),
            );
        }

        return void next();
    }

    /**
     * @param {import('express').Request} req
     */
    #tokenFromCookie(req) {
        const cookies = requestCookies(req);
        const token = cookies.access_token;
        if (!token) {
            return null;
        }

        return token;
    }
}
