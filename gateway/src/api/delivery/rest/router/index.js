import renderOpts, { render } from '#lib/ejs/render.js';

import { Router } from 'express';

/**
 * @returns {Router}
 */
export function ApiRouter() {
    const app = Router();
    const v1Router = Router();

    app.get('/ping', (_, res) => {
        res.render(...renderOpts('index', {}));
    });
    app.get('/login', async (_, res) =>
        render(res).template('pages/login', {}),
    );

    app.post('/login', async (_, res) =>
        render(res).template('pages/login-errors.oob', {
            errors: {
                password: 'Invalid username or password',
                email: 'Invalid email',
            },
        }),
    );

    app.link('/api/v1', v1Router);

    return app;
}
