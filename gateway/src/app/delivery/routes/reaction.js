import express from 'express';

/**
 * @param {import('express').Router} interactionRouter
 * @param {import('express').Router} commentRouter
 */
export function ReactionRoutes(interactionRouter, commentRouter) {
    const reactionRouter = express.Router();

    reactionRouter.use('/interactions', interactionRouter);
    reactionRouter.use('/comments', commentRouter);

    return reactionRouter;
}
