import { ClientException } from '#app/common/error.js';
import { render } from '#lib/ejs/render.js';
import { validate } from '#lib/validator/validator.js';

import { getAuthToken } from '../common/session.js';

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

export class CollectionController {
    /** @type {import("#app/services").CollectionService} */
    #collectionService;

    /**
     * @param {import("#app/services").CollectionService} collectionService
     */
    constructor(collectionService) {
        this.#collectionService = collectionService;
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async createCollection(req, res) {
        const errors = validate(req);
        if (!errors.isEmpty()) {
            return render(res).template('components/toast.oob', {
                initiator: 'Колекції',
                message: JSON.stringify(errors.mapped()),
                variant: 'danger',
            });
        }

        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const { name, description } = req.body;
        await this.#collectionService.createCollection(
            name,
            token,
            description,
        );

        const userId = req.user.id;
        const collections = await this.#collectionService.getUserCollections(
            userId,
            token,
        );

        return render(res).template('bookmark/collection-list.oob', {
            collections,
            targetId: req.query.targetId,
        });
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async deleteCollection(req, res) {
        const errors = validate(req);
        if (!errors.isEmpty()) {
            return render(res).template('components/toast.oob', {
                initiator: 'Колекції',
                message: JSON.stringify(errors.mapped()),
                variant: 'danger',
            });
        }

        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const { collectionId } = req.params;
        await this.#collectionService.deleteCollection(collectionId, token);

        const userId = req.user.id;
        const collections = await this.#collectionService.getUserCollections(
            userId,
            token,
        );

        return render(res).template('bookmark/collection-list.oob', {
            collections,
            targetId: req.query.targetId,
        });
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async getUserCollections(req, res) {
        const errors = validate(req);
        if (!errors.isEmpty()) {
            return render(res).template('components/toast.oob', {
                initiator: 'Колекції',
                message: JSON.stringify(errors.mapped()),
                variant: 'danger',
            });
        }

        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const { userId } = req.params;
        const collections = await this.#collectionService.getUserCollections(
            userId,
            token,
        );

        return render(res).template('bookmark/collection-list', {
            collections,
            targetId: req.query.targetId,
        });
    }
}
