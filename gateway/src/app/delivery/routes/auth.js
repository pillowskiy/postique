import express from 'express';
import { body } from 'express-validator';

import handler from '../common/handler.js';

/**
 * @param {import("#app/delivery/controllers").AuthController} authController
 * @param {import("#app/delivery/middlewares").CSRFMiddlewares} csrfMiddlewares
 */
export function AuthRoutes(authController, csrfMiddlewares) {
    const authRouter = express.Router();

    authRouter.get(
        '/login',
        csrfMiddlewares.withCSRF.bind(csrfMiddlewares),
        handler(authController, 'loginView'),
    );
    authRouter.post(
        '/login',
        csrfMiddlewares.verifyCsrfToken.bind(csrfMiddlewares),
        [
            body('email')
                .isEmail()
                .withMessage('Вкажіть коректний адрес електронної пошти')
                .isLength({ max: 256 })
                .withMessage(
                    'Адреса електронної пошти не може бути довшою за 256 символів',
                ),
            body('password')
                .isLength({ min: 6 })
                .withMessage('Пароль має містити принаймні 6 символів')
                .isLength({ max: 256 })
                .withMessage('Пароль не може бути довшим за 256 символів'),
        ],
        handler(authController, 'loginUser'),
    );

    authRouter.get(
        '/register',
        csrfMiddlewares.withCSRF.bind(csrfMiddlewares),
        handler(authController, 'registerView'),
    );

    authRouter.post(
        '/register',
        csrfMiddlewares.verifyCsrfToken.bind(csrfMiddlewares),
        [
            body('username')
                .isString()
                .isLength({ min: 3 })
                .withMessage('Username must be at least 3 characters')
                .isLength({ max: 256 })
                .withMessage('Username must be at most 256 characters'),
            body('email')
                .isEmail()
                .withMessage('Invalid email format')
                .isLength({ max: 256 })
                .withMessage('Email must be at most 256 characters'),
            body('password')
                .isLength({ min: 6 })
                .withMessage('Password must be at least 6 characters')
                .isLength({ max: 256 })
                .withMessage('Password must be at most 256 characters'),
            body('passwordConfirm').custom((value, { req }) => {
                if (value?.length < 6 || value !== req.body.password) {
                    throw new Error('Passwords must match');
                }
                return true;
            }),
        ],
        handler(authController, 'registerUser'),
    );

    return authRouter;
}
