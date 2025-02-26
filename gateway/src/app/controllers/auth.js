/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */
import { LoginDTO, RegisterDTO } from '#app/dto/index.js';
import { render } from '#lib/ejs/render.js';
import { validate } from '#lib/validator/validator.js';

export class AuthController {
    /** @type {import("#app/services").AuthService} */
    #authService;

    #refreshTokenLifetime = 30 * 24 * 60 * 60 * 1000; // 30 days

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
        const errors = validate(req);
        if (!errors.isEmpty()) {
            return render(res).template('auth/register/form-errors.oob', {
                errors: errors.mapped(),
            });
        }

        const dto = new RegisterDTO(
            req.body.username,
            req.body.email,
            req.body.password,
        );
        await this.#authService.register(dto);
        return this.loginUser(req, res);
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async loginUser(req, res) {
        const errors = validate(req);
        if (!errors.isEmpty()) {
            return render(res).template('auth/register/form-errors.oob', {
                errors: errors.mapped(),
            });
        }

        const dto = new LoginDTO(req.body.email, req.body.password);
        const session = await this.#authService.login(dto);
        this.#storeSession(res, session);
        res.set('HX-Redirect', '/ping').status(200).send('OK');
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
            maxAge: this.#refreshTokenLifetime,
            path: '/',
            sameSite: 'strict',
            secure: res.locals.secure,
        });
    }
}
