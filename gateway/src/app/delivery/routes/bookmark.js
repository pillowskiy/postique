import express from 'express';
import { body, param, query } from 'express-validator';

import handler from '../common/handler.js';

/**
 * @param {express.Router} bookmarkController
 * @param {import('#app/delivery/middlewares').AuthMiddlewares} authMiddlewares
 */
export function BookmarkRoutes(bookmarkController, authMiddlewares) {
    const bookmarkRouter = express.Router();

    bookmarkRouter.post(
        '/:targetId',
        authMiddlewares.withAuth.bind(authMiddlewares),
        [
            param('targetId').isString().isLength({ min: 1 }),
            query('collectionId').optional().isString(),
        ],
        handler(bookmarkController, 'addBookmark'),
    );

    bookmarkRouter.delete(
        '/:targetId',
        authMiddlewares.withAuth.bind(authMiddlewares),
        [
            param('targetId').isString().isLength({ min: 1 }),
            query('collectionId').optional().isString(),
        ],
        handler(bookmarkController, 'deleteBookmark'),
    );

    bookmarkRouter.get(
        '/popup/:targetId',
        authMiddlewares.withAuth.bind(authMiddlewares),
        [param('targetId').isString().isLength({ min: 1 })],
        handler(bookmarkController, 'getBookmarkPopup'),
    );

    bookmarkRouter.get(
        '/recently',
        authMiddlewares.withAuth.bind(authMiddlewares),
        handler(bookmarkController, 'getRecentlyView'),
    );

    bookmarkRouter.get(
        '/watchlist',
        authMiddlewares.withAuth.bind(authMiddlewares),
        [query('cursor').optional().isString(), query('pageSize').optional()],
        handler(bookmarkController, 'getWatchlist'),
    );

    return bookmarkRouter;
}
