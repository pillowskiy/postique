import express from 'express';

/**
 * @param {import('express').Router} interactionRouter
 * @param {import('express').Router} commentRouter
 * @param {import('express').Router} bookmarkRouter
 * @param {import('express').Router} collectionRouter
 * @param {import('express').Router} likeRouter
 */
export function ReactionRoutes(
    interactionRouter,
    commentRouter,
    bookmarkRouter,
    collectionRouter,
    likeRouter,
) {
    const reactionRouter = express.Router();

    reactionRouter.use('/interactions', interactionRouter);
    reactionRouter.use('/comments', commentRouter);
    reactionRouter.use('/bookmarks', bookmarkRouter);
    reactionRouter.use('/collections', collectionRouter);
    reactionRouter.use('/likes', likeRouter);

    return reactionRouter;
}
