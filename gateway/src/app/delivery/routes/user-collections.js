import express from 'express';

import handler from '../common/handler.js';

/**
 * @param {import("#app/delivery/controllers").UserCollectionsController} userCollectionsController
 */
export function UserCollectionsRoutes(userCollectionsController) {
    const userCollectionsRouter = express.Router({ mergeParams: true });

    userCollectionsRouter.get(
        '/:slug',
        handler(userCollectionsController, 'getUserCollectionView'),
    );

    return userCollectionsRouter;
}
