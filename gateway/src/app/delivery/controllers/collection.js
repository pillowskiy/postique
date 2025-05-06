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
        const collection = await this.#collectionService.createCollection(
            token,
            name,
            description,
        );

        const view = req.query.view;
        const targetId = req.query.targetId;

        /** @type {any|null} */
        let template = null;
        switch (view) {
            case 'detail':
                template = 'collection/collection-detailed-list.partial';
                break;
            case 'menu':
                template = 'collection/collection-menu-list.partial';
                break;
        }

        if (!template) {
            return res.status(204).send();
        }

        /** @type {import("#app/models").DetailedCollection} */
        const detailedCollection = {
            ...collection,
            bookmarksCount: 0,
            author: req.user,
        };

        return render(res).template(template, {
            collections: [detailedCollection],
            targetId,
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

        return res.status(204).send();
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

        return render(res).template(
            'collection/collection-detailed-list.partial',
            {
                collections,
                targetId: req.query.targetId,
            },
        );
    }
}
