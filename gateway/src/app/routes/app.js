import express from 'express';

/**
 * @param {express.Router} authRouter
 * @param {import("#app/middlewares").AuthMiddlewares} authMiddlewares
 * @param {import("#app/middlewares").GeneralMiddlewares} middlewares
 */
export function AppRoutes(authRouter, authMiddlewares, middlewares) {
    const appRouter = express.Router();

    appRouter.use(middlewares.responseResult.bind(middlewares));

    appRouter.get(
        '/ping',
        authMiddlewares.withAuth.bind(authMiddlewares),
        (_, res) => {
            res.send('pong');
        },
    );

    appRouter.use(authRouter);
    appRouter.use(middlewares.exception.bind(middlewares));

    return appRouter;
}
