/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */
import { ClientException } from '#app/common/error.js';

import { getAuthToken } from '../common/session.js';

export class LikeController {
    /** @type {import("#app/services").LikeService} */
    #likeService;

    /**
     * @param {import("#app/services").LikeService} likeService
     */
    constructor(likeService) {
        this.#likeService = likeService;
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async toggleLike(req, res) {
        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const { postId } = req.params;
        await this.#likeService.toggleLike(postId, token);

        res.status(200).send();
    }
}
