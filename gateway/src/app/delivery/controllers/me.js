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

    /**
     * @param {import("#app/services").PostService} postService
     */
    constructor(postService) {
        this.#postService = postService;
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

        const status = 'draft';
        const take = 30;
        const skip = 0;

        const posts = await this.#postService.getPostsByStatus(
            token,
            status,
            take,
            skip,
        );
        const draftCount = posts.length;

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
