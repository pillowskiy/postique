import { render } from '#lib/ejs/render.js';
import { validate } from '#lib/validator/validator.js';

import { getAuthToken } from '../common/session.js';

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

export class UserCollectionsController {
    /** @type {import("#app/services").UserService} */
    #userService;

    /** @type {import("#app/services").CollectionService} */
    #collectionService;

    /**
     * @param {import("#app/services").CollectionService} collectionService
     * @param {import("#app/services").UserService} userService
     */
    constructor(collectionService, userService) {
        this.#collectionService = collectionService;
        this.#userService = userService;
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async getUserCollectionView(req, res) {
        const errors = validate(req);
        if (!errors.isEmpty()) {
            return render(res).template('components/toast.oob', {
                initiator: 'Колекції',
                message: JSON.stringify(errors.mapped()),
                variant: 'danger',
            });
        }

        const { slug } = req.params;

        const token = getAuthToken(req);
        const [target, collection] = await Promise.all([
            this.#userService.getProfile(req.params.username),
            this.#collectionService.getDetailedCollection(slug, token),
        ]);

        return render(res)
            .template('user/collections/collection-page', {
                collection,
                target,
            })
            .layout('user-layout');
    }
}
