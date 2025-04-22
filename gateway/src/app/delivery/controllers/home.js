import { render } from '#lib/ejs/render.js';

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

import { getAuthToken } from '../common/session.js';

export class HomeController {
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
    async getHomeView(req, res) {
        const token = getAuthToken(req);

        const data = await this.#postService.getPosts(token, 30, null);

        return render(res)
            .template('home/home-page', {
                posts: data.items,
            })
            .layout('grid-layout');
    }
}
