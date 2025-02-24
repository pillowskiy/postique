import express from 'express';

/**
 * @param {express.Router} authRouter
 */
export function AppRoutes(authRouter) {
    const appRouter = express.Router();

    appRouter.get('/ping', (_, res) => {
        res.send('pong');
    });

    appRouter.use(authRouter);

    return appRouter;
}
