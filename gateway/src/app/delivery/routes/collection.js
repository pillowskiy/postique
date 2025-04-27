import express from 'express';
import { body, param, query } from 'express-validator';

import handler from '../common/handler.js';

/**
 * @param {express.Router} collectionController
 * @param {import('#app/delivery/middlewares').AuthMiddlewares} authMiddlewares
 */
export function CollectionRoutes(collectionController, authMiddlewares) {
    const collectionRouter = express.Router();

    collectionRouter.post(
        '/',
        authMiddlewares.withAuth.bind(authMiddlewares),
        [
            body('name').isString().isLength({ min: 1 }),
            body('description').optional().isString(),
            body('targetId').optional().isString(),
        ],
        handler(collectionController, 'createCollection'),
    );

    collectionRouter.delete(
        '/:collectionId',
        authMiddlewares.withAuth.bind(authMiddlewares),
        [
            param('collectionId').isString().isLength({ min: 1 }),
            query('targetId').optional().isString(),
        ],
        handler(collectionController, 'deleteCollection'),
    );

    collectionRouter.get(
        '/users/:userId',
        authMiddlewares.withAuth.bind(authMiddlewares),
        [
            param('userId').isString().isLength({ min: 1 }),
            query('targetId').optional().isString(),
        ],
        handler(collectionController, 'getUserCollections'),
    );

    return collectionRouter;
}
