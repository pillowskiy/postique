import express from 'express';

/**
 * @param {import("express").Router} userCollectionsRouter
 * @param {import("express").Router} userViewRouter
 */
export function UserRoutes(userCollectionsRouter, userViewRouter) {
    const userRouter = express.Router({ mergeParams: true });

    userRouter.use('/collections', userCollectionsRouter);
    userRouter.use('/', userViewRouter);

    return userRouter;
}
