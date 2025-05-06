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

    /** @type {import("#app/services").PostService} */
    #postService;

    /**
     * @param {import("#app/services").BookmarkService} bookmarkService
     * @param {import("#app/services").CollectionService} collectionService
     * @param {import("#app/services").PostService} postService
     */
    constructor(bookmarkService, collectionService, postService) {
        this.#bookmarkService = bookmarkService;
        this.#collectionService = collectionService;
        this.#postService = postService;
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async getRecentlyView(req, res) {
        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const data = await this.#bookmarkService.getUserBookmarks(
            req.user.id,
            token,
            null,
            2,
        );

        const posts = await this.#postService.findBatch(
            token,
            data.items.map((b) => b.targetId),
        );

        if (posts.length < 1) {
            return res.status(204).send();
        }

        return render(res).template('post/post-aside-card-list.swap', {
            posts,
        });
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

        const { collectionId } = req.query;
        const { targetId } = req.params;
        await this.#bookmarkService.addBookmark(targetId, collectionId, token);

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

        const { collectionId } = req.query;
        const { targetId } = req.params;
        await this.#bookmarkService.deleteBookmark(
            targetId,
            collectionId,
            token,
        );

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

    async getCollectionBookmarksView(req, res) {
        const errors = validate(req);
        if (!errors.isEmpty()) {
            return render(res).template('components/toast.oob', {
                initiator: 'Колекції',
                message: JSON.stringify(errors.mapped()),
                variant: 'danger',
            });
        }

        const { cursor, pageSize } = req.query;

        const token = getAuthToken(req);
        const bookmarks = await this.#bookmarkService.getCollectionBookmarks(
            token,
            req.params.collectionId,
            cursor,
            pageSize,
        );

        const posts = await this.#postService
            .findBatch(
                token,
                bookmarks.items.map((b) => b.targetId),
            )
            .then((posts) => {
                /** @type {Record<string, import("#app/models").PostWithOwner>} */
                const agg = {};
                return posts.reduce((acc, post) => {
                    acc[post.id] = post;
                    return acc;
                }, agg);
            })
            .catch(() => ({}));

        console.log(posts);

        const aggregatedBookmarks = bookmarks.items.map((b) => {
            const post = posts[b.targetId];
            return {
                ...b,
                post: post ?? {
                    ...b.post,
                    owner: {
                        id: b.userId,
                        username: 'Заблокований автор',
                        avatarUrl: '',
                    },
                },
            };
        });

        return render(res).template(
            'bookmark/partials/bookmarks-view.partial',
            {
                bookmarks: aggregatedBookmarks,
                collectionId: req.params.collectionId,
            },
        );
    }
}
