import { render } from '#lib/ejs/render.js';
import { validate } from '#lib/validator/validator.js';

import { getAuthToken } from '../common/session.js';

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

export class UserCollectionsController {
    /** @param {import("#app/services").BookmarkService} */
    #bookmarkService;

    /** @type {import("#app/services").PostService} */
    #postService;

    /** @type {import("#app/services").CollectionService} */
    #collectionService;

    /**
     * @param {import("#app/services").BookmarkService} bookmarkService
     * @param {import("#app/services").PostService} postService
     * @param {import("#app/services").CollectionService} collectionService
     */
    constructor(bookmarkService, postService, collectionService) {
        this.#bookmarkService = bookmarkService;
        this.#postService = postService;
        this.#collectionService = collectionService;
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
        const collection = await this.#collectionService.getDetailedCollection(
            slug,
            token,
        );

        return render(res)
            .template('user/collections/collection-page', {
                collection,
            })
            .layout('grid-layout');
    }
}
