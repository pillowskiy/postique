import { render } from '#lib/ejs/render.js';

import express from 'express';

/**
 * @param {express.Router} authRouter
 * @param {express.Router} postFacadeRouter
 * @param {express.Router} meRouter
 * @param {express.Router} homeRouter
 * @param {express.Router} reactionRouter
 * @param {import("#app/delivery/middlewares").AuthMiddlewares} authMiddlewares
 * @param {import("#app/delivery/middlewares").GeneralMiddlewares} middlewares
 */
export function AppRoutes(
    authRouter,
    postFacadeRouter,
    meRouter,
    homeRouter,
    reactionRouter,
    authMiddlewares,
    middlewares,
) {
    const appRouter = express.Router();

    appRouter.use(authMiddlewares.withGlobalAuthLocals.bind(authMiddlewares));
    appRouter.use(middlewares.responseResult.bind(middlewares));

    appRouter.get(
        '/new-story',
        authMiddlewares.withAuth.bind(authMiddlewares),
        async (_, res) =>
            render(res)
                .template('workbench/workbench-page', {})
                .layout('workbench/workbench-layout'),
    );

    appRouter.use(authRouter);
    appRouter.use(homeRouter);
    appRouter.use('/p', postFacadeRouter);
    appRouter.use('/r', reactionRouter);
    appRouter.use('/me', meRouter);
    appRouter.use(middlewares.exception.bind(middlewares));

    return appRouter;
}
