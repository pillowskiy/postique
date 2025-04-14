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

    // TEMP: DIP, remove this
    #fallbackCache = new Map();

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
    async withGlobalAuthLocals(req, res, next) {
        try {
            if (req.method !== 'GET') {
                return;
            }

            const start = Date.now();
            const token = this.#tokenFromCookie(req);
            if (!token) {
                res.locals.user = null;
                return;
            }

            const user = await this.#unsafe_dirtyVerify(token).catch(
                () => null,
            );
            const end = Date.now();
            this.#logger.debug?.(
                {},
                'User verification took %dms',
                end - start,
            );
            res.locals.user = user;
        } finally {
            return void next();
        }
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
     * This is temporary solution to verify user with look aside cache
     * In the future it should be replaced with a more sophisticated solution
     * e.g. validation lifetime of jwt token manually
     * @param {string} token
     * @returns {Promise<import('#app/models').User>}
     */
    async #unsafe_dirtyVerify(token) {
        const cachedUser = this.#fallbackCache.get(token);
        if (cachedUser) {
            return cachedUser;
        }

        const user = await this.#verify(token);
        this.#fallbackCache.set(token, user);
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
