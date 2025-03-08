/** @typedef{import("#shared/logger").Logger} Logger */
/** @typedef{import("#app/services").AuthService} AuthService */
import { ClientException } from '#app/common/error.js';
import { requestCookies } from '#lib/rest/cookie.js';

import { storeSession } from '../common/session.js';

export class AuthMiddlewares {
    /** @type {Logger} */
    #logger;

    /** @type {AuthService} */
    #authService;

    #exception = new ClientException(
        'Only authorizied users can access this resource',
        401,
    );

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
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    async withAuth(req, res, next) {
        try {
            const accessToken = this.#tokenFromCookie(req);
            if (!accessToken) {
                throw this.#exception;
            }

            const user = await this.#verify(accessToken);
            req.user = user;
        } catch (err) {
            if (err instanceof ClientException && err.status === 401) {
                this.#logger.info({}, 'Session expired, refreshing');
                return this.#refreshSessionAndRetry(req, res, next);
            }

            this.#logger.error({ ...err }, 'Failed to verify session');
            return void next(ClientException.fromError(err));
        }

        return void next();
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    async #refreshSessionAndRetry(req, res, next) {
        const refreshToken = this.#tokenFromCookie(req, 'refresh_token');
        if (!refreshToken) {
            this.#logger.debug({}, 'No refresh token found, aborting');
            return void next(this.#exception);
        }

        try {
            const session = await this.#authService.refresh(refreshToken);
            storeSession(res, session);
            const user = await this.#verify(session.accessToken);
            req.user = user;
        } catch (err) {
            this.#logger.error(
                { message: err.message },
                'Failed to refresh session',
            );
            res.cookie('refresh_token', '', { maxAge: -1 });
            void next(ClientException.fromError(err));
        }

        return void next();
    }

    /**
     * @param {string} token
     * @returns {Promise<import('#app/models').User>}
     */
    async #verify(token) {
        const user = await this.#authService.verify(token);
        this.#logger.info({ user }, 'User successfully verified');
        return user;
    }

    /**
     * @param {import('express').Request} req
     * @param {'access_token' | 'refresh_token'} tokenType
     */
    #tokenFromCookie(req, tokenType = 'access_token') {
        const cookies = requestCookies(req);
        const token = cookies[tokenType];
        if (!token) {
            return null;
        }

        return token;
    }
}
