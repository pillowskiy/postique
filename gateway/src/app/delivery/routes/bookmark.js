import express from 'express';
import { body, param } from 'express-validator';

import handler from '../common/handler.js';

/**
 * @param {express.Router} bookmarkController
 * @param {import('#app/delivery/middlewares').AuthMiddlewares} authMiddlewares
 */
export function BookmarkRoutes(bookmarkController, authMiddlewares) {
    const bookmarkRouter = express.Router();

    bookmarkRouter.post(
        '/',
        authMiddlewares.withAuth.bind(authMiddlewares),
        [
            body('targetId').isString().isLength({ min: 1 }),
            body('collectionId').optional().isString(),
        ],
        handler(bookmarkController, 'addBookmark'),
    );

    bookmarkRouter.delete(
        '/:targetId',
        authMiddlewares.withAuth.bind(authMiddlewares),
        [param('targetId').isString().isLength({ min: 1 })],
        handler(bookmarkController, 'deleteBookmark'),
    );

    bookmarkRouter.get(
        '/popup/:targetId',
        authMiddlewares.withAuth.bind(authMiddlewares),
        [param('targetId').isString().isLength({ min: 1 })],
        handler(bookmarkController, 'getBookmarkPopup'),
    );

    return bookmarkRouter;
}
