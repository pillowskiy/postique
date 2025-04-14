/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */
import { LoginDTO, RegisterDTO } from '#app/dto/index.js';
import { render } from '#lib/ejs/render.js';
import { validate } from '#lib/validator/validator.js';

import { storeSession } from '../common/session.js';

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
            return render(res).template('auth/login/form-errors.oob', {
                errors: errors.mapped(),
            });
        }

        const dto = new LoginDTO(req.body.email, req.body.password);
        const session = await this.#authService.login(dto);
        storeSession(res, session);
        res.set('HX-Redirect', '/ping').status(200).send('OK');
    }
}
