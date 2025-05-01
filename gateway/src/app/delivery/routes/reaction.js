import express from 'express';

/**
 * @param {import('express').Router} interactionRouter
 * @param {import('express').Router} commentRouter
 * @param {import('express').Router} bookmarkRouter
 * @param {import('express').Router} collectionRouter
 * @param {import('express').Router} likeRouter
 * @param {import('express').Router} viewRouter
 */
export function ReactionRoutes(
    interactionRouter,
    commentRouter,
    bookmarkRouter,
    collectionRouter,
    likeRouter,
    viewRouter,
) {
    const reactionRouter = express.Router();

    reactionRouter.use('/interactions', interactionRouter);
    reactionRouter.use('/comments', commentRouter);
    reactionRouter.use('/bookmarks', bookmarkRouter);
    reactionRouter.use('/collections', collectionRouter);
    reactionRouter.use('/likes', likeRouter);
    reactionRouter.use('/views', viewRouter);

    return reactionRouter;
}
