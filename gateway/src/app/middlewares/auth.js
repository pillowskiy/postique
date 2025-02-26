/** @typedef{import("#shared/logger").Logger} Logger */
/** @typedef{import("#app/services").AuthService} AuthService */
import { ClientException } from '#app/common/error.js';

import cookieParser from 'cookie-parser';

export class AuthMiddlewares {
    /** @type {Logger} */
    #logger;

    /** @type {AuthService} */
    #authService;

    /** @type {ReturnType<import('cookie-parser')>} */
    #cookieParser;

    /**
     * @param {Logger} logger
     * @param {AuthService} authService
     */
    constructor(logger, authService) {
        this.#logger = logger;
        this.#authService = authService;
        this.#cookieParser = cookieParser();
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    withAuth(req, res, next) {
        return this.#cookieParser(req, res, async () => {
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
        });
    }

    /**
     * @param {import('express').Request} req
     */
    #tokenFromCookie(req) {
        const token = req.cookies.access_token;
        if (!token) {
            return null;
        }

        return token;
    }
}
