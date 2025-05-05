import express from 'express';

/**
 * @param {express.Router} postRouter
 * @param {express.Router} preferenceRouter
 */
export function PostFacadeRoutes(postRouter, preferenceRouter) {
    const postBridgeRouter = express.Router();

    postBridgeRouter.use('/', postRouter);
    postBridgeRouter.use('/preferences', preferenceRouter);

    return postBridgeRouter;
}
