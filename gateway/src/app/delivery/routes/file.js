import express from 'express';

import handler from '../common/handler.js';

/**
 * @param {import("#app/delivery/controllers").FileController} fileController
 * @param {import("#app/delivery/middlewares").AuthMiddlewares} authMiddlewares
 * @param {import("#app/delivery/middlewares").GeneralMiddlewares} middlewares
 */
export function FileRoutes(fileController, authMiddlewares, middlewares) {
    const router = express.Router();

    router.post(
        '/upload',
        authMiddlewares.withAuth.bind(authMiddlewares),
        middlewares
            .singleFile({ allowEmpty: false, optional: false })
            .bind(middlewares),
        handler(fileController, 'upload'),
    );

    return router;
}
