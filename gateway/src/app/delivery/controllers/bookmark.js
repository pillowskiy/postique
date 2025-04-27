import { ClientException } from '#app/common/error.js';
import { render } from '#lib/ejs/render.js';
import { validate } from '#lib/validator/validator.js';

import { getAuthToken } from '../common/session.js';

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

export class BookmarkController {
    /** @type {import("#app/services").BookmarkService} */
    #bookmarkService;

    /** @type {import("#app/services").CollectionService} */
    #collectionService;

    /**
     * @param {import("#app/services").BookmarkService} bookmarkService
     * @param {import("#app/services").CollectionService} collectionService
     */
    constructor(bookmarkService, collectionService) {
        this.#bookmarkService = bookmarkService;
        this.#collectionService = collectionService;
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async addBookmark(req, res) {
        const errors = validate(req);
        if (!errors.isEmpty()) {
            return render(res).template('components/toast.oob', {
                initiator: 'Закладки',
                message: JSON.stringify(errors.mapped()),
                variant: 'danger',
            });
        }

        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const { targetId, collectionId } = req.body;
        await this.#bookmarkService.addBookmark(token, targetId, collectionId);

        return res.status(200).send();
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async deleteBookmark(req, res) {
        const errors = validate(req);
        if (!errors.isEmpty()) {
            return render(res).template('components/toast.oob', {
                initiator: 'Закладки',
                message: JSON.stringify(errors.mapped()),
                variant: 'danger',
            });
        }

        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const { targetId } = req.params;
        await this.#bookmarkService.deleteBookmark(targetId, token);

        return render(res).template('components/toast.oob', {
            initiator: 'Закладки',
            message: 'Ви успішно видалили закладку',
            variant: 'success',
        });
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async getBookmarkPopup(req, res) {
        const errors = validate(req);
        if (!errors.isEmpty()) {
            return render(res).template('components/toast.oob', {
                initiator: 'Закладки',
                message: JSON.stringify(errors.mapped()),
                variant: 'danger',
            });
        }

        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const { targetId } = req.params;
        const userId = req.user.id;

        const collections = await this.#collectionService.getUserCollections(
            userId,
            token,
        );

        return render(res).template('bookmark/bookmark-popup.oob', {
            targetId,
            collections,
        });
    }
}
