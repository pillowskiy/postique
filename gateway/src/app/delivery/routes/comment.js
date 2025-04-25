import express from 'express';
import { body, param, query } from 'express-validator';

import handler from '../common/handler.js';

/**
 * @param {import("#app/delivery/controllers").CommentController} commentController
 */
export function CommentRoutes(commentController) {
    const commentRouter = express.Router();

    commentRouter.post(
        '/:postId',
        [
            param('postId').isString().notEmpty(),
            body('content').isString().notEmpty(),
            body('parentId').optional().isString(),
        ],
        handler(commentController, 'createComment'),
    );

    commentRouter.delete(
        '/:commentId',
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
