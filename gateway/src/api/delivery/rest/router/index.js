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
    app.get('/login', async (_, res) => {
        return render('pages/login', {
            message: 'Login successful',
        }).with(res);
    });

    app.post('/login', (_, res) => {
        if (Math.random() > 0.5) {
            res.send(`
                <div class="alert alert-success">${'Login successful'}</div>
            `);
        } else {
            res.send(`
                <div class="alert alert-info">${'Invalid usernme or password'}</div>
            `);
        }
    });

    app.link('/api/v1', v1Router);

    return app;
}
