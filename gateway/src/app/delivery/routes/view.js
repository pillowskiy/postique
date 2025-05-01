import express from 'express';
import { param } from 'express-validator';

import handler from '../common/handler.js';

/**
 * @param {import("#app/delivery/controllers").ViewController} viewController
 * @param {import("#app/delivery/middlewares").AuthMiddlewares} authMiddlewares
 */
export function ViewRoutes(viewController, authMiddlewares) {
    const viewRouter = express.Router();

    viewRouter.get(
        '/history',
        authMiddlewares.withAuth.bind(authMiddlewares),
        handler(viewController, 'getUserHistory'),
    );

    viewRouter.delete(
        '/:targetId',
        [param('targetId').isString().isLength({ min: 1 })],
        authMiddlewares.withAuth.bind(authMiddlewares),
        handler(viewController, 'removeView'),
    );

    viewRouter.delete(
        '/history',
        authMiddlewares.withAuth.bind(authMiddlewares),
        handler(viewController, 'clearHistory'),
    );

    return viewRouter;
}
