import { render } from '#lib/ejs/render.js';
import { validate } from '#lib/validator/validator.js';

import { getAuthToken } from '../common/session.js';

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

export class UserViewController {
    /** @type {import("#app/services").UserService} */
    #userService;

    /** @type {import("#app/services").PostService} */
    #postService;

    /** @type {import("#app/services").CollectionService} */
    #collectionService;

    /**
     * @param {import("#app/services").UserService} userService
     * @param {import("#app/services").PostService} postService
     * @param {import("#app/services").CollectionService} collectionService
     */
    constructor(userService, postService, collectionService) {
        this.#userService = userService;
        this.#postService = postService;
        this.#collectionService = collectionService;
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async getUserPostsView(req, res) {
        if (!req.headers['hx-request']) {
            return this._getUserPageView(req, res);
        }

        const errors = validate(req);
        if (!errors.isEmpty()) {
            return render(res).template('components/toast.oob', {
                initiator: 'Публікації',
                message: JSON.stringify(errors.mapped()),
                variant: 'danger',
            });
        }

        const token = getAuthToken(req);
        const { cursor, pageSize } = req.query;

        const { username } = req.params;
        const user = await this.#userService.getProfile(username);

        const data = await this.#postService.getPosts(
            token,
            pageSize,
            cursor,
            user.id,
        );

        return render(res).template('user/partial/user-posts-view.partial', {
            posts: data.items,
        });
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async getUserCollectionsView(req, res) {
        if (!req.headers['hx-request']) {
            return this._getUserPageView(req, res);
        }

        const errors = validate(req);
        if (!errors.isEmpty()) {
            return render(res).template('components/toast.oob', {
                initiator: 'Колекції',
                message: JSON.stringify(errors.mapped()),
                variant: 'danger',
            });
        }

        const token = getAuthToken(req);
        const { username } = req.params;
        const user = await this.#userService.getProfile(username);

        const collections = await this.#collectionService.getUserCollections(
            user.id,
            token,
        );

        return render(res).template(
            'user/partial/user-collections-view.partial',
            {
                collections,
            },
        );
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async _getUserPageView(req, res) {
        const errors = validate(req);
        if (!errors.isEmpty()) {
            return render(res).template('components/toast.oob', {
                initiator: 'Профіль',
                message: JSON.stringify(errors.mapped()),
                variant: 'danger',
            });
        }

        const { username } = req.params;
        const user = await this.#userService.getProfile(username);

        return render(res)
            .template('user/user-page', {
                target: user,
            })
            .layout('user-layout');
    }
}
