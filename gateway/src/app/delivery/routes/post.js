import express from 'express';
import { body, param } from 'express-validator';

import handler from '../common/handler.js';

/**
 * @param {import("#app/delivery/controllers").PostController} postController
 * @param {import("#app/delivery/middlewares").AuthMiddlewares} authMiddlewares
 * @param {import("#app/delivery/middlewares").GeneralMiddlewares} middlewares
 */
export function PostRoutes(postController, authMiddlewares, middlewares) {
    const postRouter = express.Router();

    postRouter.post(
        '/',
        authMiddlewares.withAuth.bind(authMiddlewares),
        [
            body('title')
                .isString()
                .isLength({ min: 1 })
                .withMessage('Title is required')
                .isLength({ max: 256 })
                .withMessage('Title must be at most 256 characters'),
            body('description')
                .isString()
                .optional()
                .isLength({ max: 1000 })
                .withMessage('Description must be at most 1000 characters'),
            body('visibility')
                .isString()
                .optional()
                .isIn(['public', 'private', 'unlisted'])
                .withMessage('Visibility must be public, private, or unlisted'),
        ],
        handler(postController, 'createPost'),
    );

    postRouter.get(
        '/:postId/edit',
        authMiddlewares.withAuth.bind(authMiddlewares),
        [param('postId').isString().withMessage('Should be a string')],
        handler(postController, 'getNewStoryView'),
    );

    postRouter.get(
        '/:slug',
        [param('slug').isString().withMessage('Invalid slug format')],
        handler(postController, 'getPost'),
    );

    postRouter.get(
        '/:id/info',
        authMiddlewares.withAuth.bind(authMiddlewares),
        [
            param('id')
                .isString()
                .withMessage('Invalid id')
                .isUUID()
                .withMessage('Invalid id'),
        ],
        handler(postController, 'getPostInfo'),
    );

    postRouter.get(
        '/:id/draft',
        authMiddlewares.withAuth.bind(authMiddlewares),
        [
            param('id')
                .isString()
                .withMessage('Invalid id')
                .isUUID()
                .withMessage('Invalid id'),
        ],
        handler(postController, 'getPostDraft'),
    );

    postRouter.patch(
        '/:id/visibility',
        authMiddlewares.withAuth.bind(authMiddlewares),
        [
            param('id').isUUID().withMessage('Invalid post ID'),
            body('visibility')
                .isString()
                .isIn(['public', 'private', 'unlisted'])
                .withMessage('Visibility must be public, private, or unlisted'),
        ],
        handler(postController, 'changeVisibility'),
    );

    postRouter.patch(
        '/:id/archive',
        authMiddlewares.withAuth.bind(authMiddlewares),
        [param('id').isUUID().withMessage('Invalid post ID')],
        handler(postController, 'archivePost'),
    );

    postRouter.patch(
        '/:id/publish',
        authMiddlewares.withAuth.bind(authMiddlewares),
        middlewares.singleFile({ optional: true }).bind(middlewares),
        [
            param('id').isUUID().withMessage('Invalid post ID'),
            body('title')
                .isString()
                .optional()
                .isLength({ max: 256 })
                .withMessage('Title must be at most 256 characters'),
            body('description')
                .isString()
                .optional()
                .isLength({ max: 512 })
                .withMessage('Description must be at most 512 characters'),
        ],
        handler(postController, 'publishPost'),
    );

    postRouter.delete(
        '/:id',
        authMiddlewares.withAuth.bind(authMiddlewares),
        [param('id').isUUID().withMessage('Invalid post ID')],
        handler(postController, 'deletePost'),
    );

    postRouter.patch(
        '/:id/delta',
        authMiddlewares.withAuth.bind(authMiddlewares),
        [
            param('id').isUUID().withMessage('Invalid post ID'),
            body('deltas').isArray().withMessage('Deltas must be an array'),
        ],
        handler(postController, 'saveDelta'),
    );

    postRouter.patch(
        '/:id/transfer',
        authMiddlewares.withAuth.bind(authMiddlewares),
        [
            param('id').isUUID().withMessage('Invalid post ID'),
            body('newOwner')
                .isString()
                .notEmpty()
                .withMessage('New owner is required'),
        ],
        handler(postController, 'transferOwnership'),
    );

    return postRouter;
}
