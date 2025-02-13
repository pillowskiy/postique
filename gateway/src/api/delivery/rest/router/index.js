import { Router } from 'express';

/**
 * @returns {Router}
 */
export function ApiRouter() {
    const app = Router();
    const v1Router = Router();

    app.get('/ping', (_, res) => res.status(200).send('pong'));
    app.link('/api/v1', v1Router);

    return app;
}
