import express from 'express';
import { param, query } from 'express-validator';

import handler from '../common/handler.js';

/**
 * @param {import("#app/delivery/controllers").MeController} meController
 * @param {import("#app/delivery/middlewares").AuthMiddlewares}authMiddlewares
 */
export function MeRoutes(meController, authMiddlewares) {
    const meRouter = express.Router();

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
        '/collections/history',
        authMiddlewares.withAuth.bind(authMiddlewares),
        handler(meController, 'getHistoryTabView'),
    );

    return meRouter;
}
