import { ClientException } from '#app/common/error.js';
import { render } from '#lib/ejs/render.js';
import { validate } from '#lib/validator/validator.js';

import { getAuthToken } from '../common/session.js';

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

export class PreferenceController {
    /** @type {import("#app/services").PreferenceService} */
    #preferenceService;

    /**
     * @param {import("#app/services").PreferenceService} preferenceService
     */
    constructor(preferenceService) {
        this.#preferenceService = preferenceService;
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async toggleAuthor(req, res) {
        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const errors = validate(req);
        if (!errors.isEmpty()) {
            return render(res).template('components/toast.oob', {
                initiator: 'Модерація',
                message: JSON.stringify(errors.mapped()),
                variant: 'danger',
            });
        }

        const { userId } = req.params;
        const { muted } = await this.#preferenceService.toggleAuthor(
            userId,
            token,
        );

        let message = '';
        if (muted) {
            message =
                'Автора заблоковано. Ви тепер не бачимите його публікації';
        } else {
            message =
                'Автора розблоковано. Ви знову можете бачити його публікації';
        }

        return render(res).template('components/toast.oob', {
            initiator: 'Модерація',
            message,
            variant: 'info',
        });
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async togglePost(req, res) {
        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const errors = validate(req);
        if (!errors.isEmpty()) {
            return render(res).template('components/toast.oob', {
                initiator: 'Модерація',
                message: JSON.stringify(errors.mapped()),
                variant: 'danger',
            });
        }

        const { postId } = req.params;
        await this.#preferenceService.togglePost(postId, token);

        return res.status(204).send();
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async getAuthorBlacklist(req, res) {
        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const errors = validate(req);
        if (!errors.isEmpty()) {
            return render(res).template('components/toast.oob', {
                initiator: 'Модерація',
                message: JSON.stringify(errors.mapped()),
                variant: 'danger',
            });
        }

        const { take, skip } = req.query;
        const blacklist = await this.#preferenceService.getAuthorBlacklist(
            take,
            skip,
            token,
        );
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async getPostBlacklist(req, res) {
        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const errors = validate(req);
        if (!errors.isEmpty()) {
            return render(res).template('components/toast.oob', {
                initiator: 'Модерація',
                message: JSON.stringify(errors.mapped()),
                variant: 'danger',
            });
        }

        const { take, skip } = req.query;
        const blacklist = await this.#preferenceService.getPostsBlacklist(
            take,
            skip,
            token,
        );
    }
}
