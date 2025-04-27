import express from 'express';

/**
 * @param {import('express').Router} interactionRouter
 * @param {import('express').Router} commentRouter
 * @param {import('express').Router} bookmarkRouter
 * @param {import('express').Router} collectionRouter
 */
export function ReactionRoutes(
    interactionRouter,
    commentRouter,
    bookmarkRouter,
    collectionRouter,
) {
    const reactionRouter = express.Router();

    reactionRouter.use('/interactions', interactionRouter);
    reactionRouter.use('/comments', commentRouter);
    reactionRouter.use('/bookmarks', bookmarkRouter);
    reactionRouter.use('/collections', collectionRouter);

    return reactionRouter;
}
