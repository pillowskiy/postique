import { ClientException } from '#app/common/error.js';

import { getAuthToken } from '../common/session.js';

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

export class ViewController {
    /** @param {import("#app/services").ViewService} viewService */
    #viewService;

    /**
     * @param {import("#app/services").ViewService} viewService
     */
    constructor(viewService) {
        this.#viewService = viewService;
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async removeView(req, res) {
        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const { targetId } = req.params;
        await this.#viewService.removeView(token, targetId);

        return res.status(200).send();
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async clearHistory(req, res) {
        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        await this.#viewService.clearHistory(token);

        return res.status(200).send();
    }
}
