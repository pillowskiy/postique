import express from 'express';

/**
 * @param {import('express').Router} interactionRouter
 */
export function ReactionRoutes(interactionRouter) {
    const reactionRouter = express.Router();

    reactionRouter.use('/interactions', interactionRouter);

    return reactionRouter;
}
