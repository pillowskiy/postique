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

    /** @type {import("#app/services").BookmarkService} */
    #bookmarkService;

    /**
     * @param {import("#app/services").PostService} postService
     * @param {import("#app/services").CollectionService} collectionService
     * @param {import("#app/services").ViewService} viewService
     * @param {import("#app/services").BookmarkService} bookmarkService
     */
    constructor(postService, collectionService, viewService, bookmarkService) {
        this.#postService = postService;
        this.#collectionService = collectionService;
        this.#viewService = viewService;
        this.#bookmarkService = bookmarkService;
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
    async getWatchlistTabView(req, res) {
        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        if (!req.headers['hx-request']) {
            return this._getCollectionsView(req, res);
        }

        const cursor = req.query.cursor ?? null;
        const pageSize = req.query.pageSize ?? null;

        const views = await this.#bookmarkService.getWatchlistBookmarks(
            token,
            cursor,
            pageSize,
        );
        console.log(views);
        const posts = await this.#postService.findBatch(
            token,
            views.items.map((v) => v.targetId),
        );

        return render(res).template(
            'me/collections/partials/watchlist-view.partial',
            {
                posts,
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

        const cursor = req.query.cursor ?? null;
        const pageSize = req.query.pageSize ?? null;

        const views = await this.#viewService.getUserHistory(
            token,
            cursor,
            pageSize,
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

    async _getCollectionsView(req, res) {
        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        return render(res)
            .template('me/collections/collections-page', {})
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
