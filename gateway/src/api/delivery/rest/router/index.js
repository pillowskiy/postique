import { render } from '#lib/ejs/render.js';

import { Router } from 'express';
import { body, validationResult } from 'express-validator';

/**
 * @returns {Router}
 */
export function ApiRouter() {
    const app = Router();
    const v1Router = Router();

    app.get('/ping', (_, res) => {
        res.send('pong');
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

    app.get('/register', async (_, res) =>
        render(res).template('auth/register/page', {}),
    );

    app.post(
        '/register',
        [
            body('username')
                .isString()
                .isLength({ min: 3 })
                .withMessage('Username must be at least 3 characters'),
            body('email').isEmail().withMessage('Invalid email format'),
            body('password')
                .isLength({ min: 6 })
                .withMessage('Password must be at least 6 characters'),
            body('passwordConfirm').custom((value, { req }) => {
                if (value?.length < 6 || value !== req.body.password) {
                    throw new Error('Passwords must match');
                }
                return true;
            }),
        ],
        async (req, res) => {
            const errors = validationResult(req).formatWith(({ msg }) => msg);
            if (!errors.isEmpty()) {
                /** @type {object} */
                const formattedErrors = errors.mapped();
                return render(res).template('auth/register/form-errors.oob', {
                    errors: formattedErrors,
                });
            }
        },
    );

    app.link('/api/v1', v1Router);

    return app;
}
