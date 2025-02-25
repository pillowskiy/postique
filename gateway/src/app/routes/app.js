import express from 'express';

/**
 * @param {express.Router} authRouter
 * @param {import("#app/middlewares").AuthMiddlewares} authMiddlewares
 */
export function AppRoutes(authRouter, authMiddlewares) {
    const appRouter = express.Router();

    appRouter.get(
        '/ping',
        authMiddlewares.withAuth.bind(authMiddlewares),
        (_, res) => {
            res.send('pong');
        },
    );

    appRouter.use(authRouter);

    return appRouter;
}
