import { ClientException } from '#app/common/error.js';
import { render } from '#lib/ejs/render.js';

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

import { getAuthToken } from '../common/session.js';

export class MeController {
    /** @type {import("#app/services").PostService} */
    #postService;

    /** @type {import("#app/services").CollectionService} */
    #collectionService;

    /** @type {import("#app/services").ViewService} */
    #viewService;

    /**
     * @param {import("#app/services").PostService} postService
     * @param {import("#app/services").CollectionService} collectionService
     * @param {import("#app/services").ViewService}viewService
     */
    constructor(postService, collectionService, viewService) {
        this.#postService = postService;
        this.#collectionService = collectionService;
        this.#viewService = viewService;
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async getNotificationsView(req, res) {
        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        return render(res)
            .template('me/notifications/notifications-page', {})
            .layout('grid-layout');
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async getCollectionsTabView(req, res) {
        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        if (!req.headers['hx-request']) {
            return this._getCollectionsView(req, res);
        }

        const collections = await this.#collectionService.getUserCollections(
            req.user.id,
            token,
        );

        return render(res).template(
            'me/collections/partials/collection-view.partial',
            {
                collections,
            },
        );
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async getHistoryTabView(req, res) {
        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        if (!req.headers['hx-request']) {
            return this._getCollectionsView(req, res);
        }

        const views = await this.#viewService.getUserHistory(
            token,
            req.query.cursor,
            req.query.take,
        );

        const posts = await this.#postService.findBatch(
            token,
            views.items.map((v) => v.targetId),
        );

        return render(res).template(
            'me/collections/partials/history-view.partial',
            {
                posts,
            },
        );
    }

    async _getCollectionsView(req, res) {
        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const collections = await this.#collectionService.getUserCollections(
            req.user.id,
            token,
        );

        return render(res)
            .template('me/collections/collections-page', {
                items: collections,
                __partialNode: 'collections-view',
            })
            .layout('grid-layout');
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async getPostsView(req, res) {
        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const status = req.params.status ?? 'draft';
        const take = 30;
        const skip = 0;

        const posts = await this.#postService.getPostsByStatus(
            token,
            status,
            take,
            skip,
        );
        const draftCount = `99+`;

        return render(res)
            .template('me/posts/posts-page', {
                posts,
                // @ts-ignore
                status,
                draftCount,
                __postList: 'components/post-draft-list.ejs',
            })
            .layout('grid-layout');
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async getPostListView(req, res) {
        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        if (!req.headers['hx-request']) {
            return this.getPostsView(req, res);
        }

        const status = req.params.status;
        const { take, skip } = req.query;
        const takeQuery = take ? parseInt(take.toString()) : 10;
        const skipQuery = skip ? parseInt(skip.toString()) : 0;

        const posts = await this.#postService.getPostsByStatus(
            token,
            status,
            takeQuery,
            skipQuery,
        );

        return render(res).template('me/posts/posts-list.partial', {
            __postList: 'components/post-draft-list.ejs',
            posts,
            status,
        });
    }
}
