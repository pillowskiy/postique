import express from 'express';

/**
 * @param {import("express").Router} userCollectionsRouter
 */
export function UserRoutes(userCollectionsRouter) {
    const userRouter = express.Router();

    userRouter.use('/collections', userCollectionsRouter);

    return userRouter;
}
