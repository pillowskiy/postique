/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */
import { render } from '#lib/ejs/render.js';

export class AuthController {
    /** @type {import("#app/services").AuthService} */
    #authService;

    /**
     * @param {import("#app/services").AuthService} authService
     */
    constructor(authService) {
        this.#authService = authService;
    }

    /**
     * @param {Request} _
     * @param {Response} res
     */
    async registerView(_, res) {
        return render(res).template('auth/register/page', {});
    }

    /**
     * @param {Request} _
     * @param {Response} res
     */
    async loginView(_, res) {
        return render(res).template('auth/login/page', {});
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async registerUser(req, res) {
        const input = req.body;
        await this.#authService.register(input);

        return res.redirect('/');
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async loginUser(req, res) {
        const input = req.body;
        const session = await this.#authService.login(input);

        this.#storeSession(res, session);

        return res.redirect('/');
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async refreshSession(req, res) {
        const input = req.body;
        const session = await this.#authService.refresh(input.token);

        this.#storeSession(res, session);
    }

    /**
     * @param {Response} res
     * @param {import("#app/models").Session} session
     */
    #storeSession(res, session) {
        res.cookie('access_token', session.accessToken, {
            domain: res.locals.hostname,
            httpOnly: true,
            maxAge: session.expiresIn * 1000,
            path: '/',
            sameSite: 'strict',
            secure: res.locals.secure,
        });

        res.cookie('refresh_token', session.refreshToken, {
            domain: res.locals.hostname,
            httpOnly: true,
            path: '/',
            sameSite: 'strict',
            secure: res.locals.secure,
        });
    }
}
