import express from 'express';

/**
 * @param {import("#app/controllers").AuthController} authController
 */
export function AuthRoutes(authController) {
    const authRouter = express.Router();

    authRouter.get('/login', (req, res) => authController.loginView(req, res));
    authRouter.post('/login', (req, res) => authController.loginUser(req, res));
    authRouter.get('/register', (req, res) =>
        authController.registerView(req, res),
    );
    authRouter.post('/register', (req, res) =>
        authController.registerUser(req, res),
    );

    return authRouter;
}
