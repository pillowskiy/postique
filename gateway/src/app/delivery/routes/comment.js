import express from 'express';
import { body, param, query } from 'express-validator';

import handler from '../common/handler.js';

/**
 * @param {import("#app/delivery/controllers").CommentController} commentController
 * @param {import('#app/delivery/middlewares').AuthMiddlewares} authMiddlewares
 */
export function CommentRoutes(commentController, authMiddlewares) {
    const commentRouter = express.Router();

    commentRouter.post(
        '/:postId',
        authMiddlewares.withAuth.bind(authMiddlewares),
        [
            param('postId').isString().notEmpty(),
            body('content').isString().notEmpty(),
            body('parentId').optional().isString(),
        ],
        handler(commentController, 'createComment'),
    );

    commentRouter.delete(
        '/:commentId',
        authMiddlewares.withAuth.bind(authMiddlewares),
        [param('commentId').isString().notEmpty()],
        handler(commentController, 'deleteComment'),
    );

    commentRouter.get(
        '/post/:postId',
        [
            param('postId').isString().notEmpty(),
            query('cursor').optional().isString(),
            query('pageSize').optional().isInt(),
        ],
        handler(commentController, 'getPostComments'),
    );

    commentRouter.get(
        '/:commentId/replies',
        [
            param('commentId').isString().notEmpty(),
            query('cursor').optional().isString(),
            query('pageSize').optional().isInt(),
        ],
        handler(commentController, 'getCommentReplies'),
    );

    return commentRouter;
}
