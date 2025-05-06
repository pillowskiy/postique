import express from 'express';

import handler from '../common/handler.js';

/**
 * @param {import("#app/delivery/controllers").UserViewController} userViewController
 */
export function UserViewRoutes(userViewController) {
    const userRouter = express.Router({ mergeParams: true });

    userRouter.get('/', handler(userViewController, 'getUserPostsView'));

    userRouter.get(
        '/collections',
        handler(userViewController, 'getUserCollectionsView'),
    );

    return userRouter;
}
