import express from 'express';
import { body } from 'express-validator';

/**
 * @param {import("#app/controllers").AuthController} authController
 */
export function AuthRoutes(authController) {
    const authRouter = express.Router();

    authRouter.get('/login', (req, res) => authController.loginView(req, res));
    authRouter.post(
        '/login',
        [
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
        ],
        authController.loginUser.bind(authController),
    );

    authRouter.get('/register', (req, res) =>
        authController.registerView(req, res),
    );
    authRouter.post(
        '/register',
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
        authController.registerUser.bind(authController),
    );

    return authRouter;
}
