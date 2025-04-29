import express from 'express';
import { param } from 'express-validator';

import handler from '../common/handler.js';

/**
 * @param {import("#app/delivery/controllers").LikeController} likeController
 * @param {import("#app/delivery/middlewares").AuthMiddlewares} authMiddlewares
 */
export function LikeRoutes(likeController, authMiddlewares) {
    const likeRouter = express.Router();

    likeRouter.post(
        '/:postId',
        authMiddlewares.withAuth.bind(authMiddlewares),
        [param('postId').isString().isLength({ min: 1 })],
        handler(likeController, 'toggleLike'),
    );

    return likeRouter;
}
