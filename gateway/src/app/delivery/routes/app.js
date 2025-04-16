import { render } from '#lib/ejs/render.js';

import express from 'express';

/**
 * @param {express.Router} authRouter
 * @param {express.Router} postRouter
 * @param {import("#app/delivery/middlewares").AuthMiddlewares} authMiddlewares
 * @param {import("#app/delivery/middlewares").GeneralMiddlewares} middlewares
 */
export function AppRoutes(
    authRouter,
    postRouter,
    authMiddlewares,
    middlewares,
) {
    const appRouter = express.Router();

    appRouter.use(authMiddlewares.withGlobalAuthLocals.bind(authMiddlewares));
    appRouter.use(middlewares.responseResult.bind(middlewares));

    appRouter.get('/', async (_, res) => render(res).template('index', {}));
    appRouter.get(
        '/new-story',
        authMiddlewares.withAuth.bind(authMiddlewares),
        async (_, res) =>
            render(res)
                .template('workbench/workbench-page', {})
                .layout('workbench/workbench-layout'),
    );

    appRouter.use(authRouter);
    appRouter.use('/p', postRouter);
    appRouter.use(middlewares.exception.bind(middlewares));

    return appRouter;
}
