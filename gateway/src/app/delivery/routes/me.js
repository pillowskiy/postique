import express from 'express';
import { body, param, query } from 'express-validator';

import handler from '../common/handler.js';

/**
 * @param {import("#app/delivery/controllers").MeController} meController
 * @param {import("#app/delivery/middlewares").AuthMiddlewares}authMiddlewares
 * @param {import("#app/delivery/middlewares").GeneralMiddlewares} middlewares
 */
export function MeRoutes(meController, authMiddlewares, middlewares) {
    const meRouter = express.Router();

    meRouter.patch(
        '/profile',
        authMiddlewares.withAuth.bind(authMiddlewares),
        [
            body('username')
                .isString()
                .optional()
                .isLength({ max: 64 })
                .withMessage('Username must be at most 64 characters'),
            body('bio')
                .isString()
                .optional()
                .isLength({ max: 256 })
                .withMessage('Description must be at most 256 characters'),
        ],
        handler(meController, 'updateProfile'),
    );

    meRouter.get(
        '/notifications',
        authMiddlewares.withAuth.bind(authMiddlewares),
        handler(meController, 'getNotificationsView'),
    );

    meRouter.get(
        '/posts',
        authMiddlewares.withAuth.bind(authMiddlewares),
        handler(meController, 'getPostsView'),
    );

    meRouter.get(
        '/posts/:status',
        authMiddlewares.withAuth.bind(authMiddlewares),
        [
            param('status')
                .isString()
                .isIn(['draft', 'published', 'archived'])
                .withMessage('Invalid status'),
            query('take').optional().isInt().withMessage('Invalid take'),
            query('skip').optional().isInt().withMessage('Invalid skip'),
        ],
        handler(meController, 'getPostListView'),
    );

    meRouter.get(
        '/collections',
        authMiddlewares.withAuth.bind(authMiddlewares),
        handler(meController, 'getCollectionsTabView'),
    );

    meRouter.get(
        '/collections/watchlist',
        authMiddlewares.withAuth.bind(authMiddlewares),
        handler(meController, 'getWatchlistTabView'),
    );

    meRouter.get(
        '/collections/history',
        authMiddlewares.withAuth.bind(authMiddlewares),
        handler(meController, 'getHistoryTabView'),
    );

    meRouter.get(
        '/recommendations',
        authMiddlewares.withAuth.bind(authMiddlewares),
        handler(meController, 'getRecommendationsView'),
    );

    return meRouter;
}
