import express from 'express';
import { body, param, query } from 'express-validator';

import handler from '../common/handler.js';

/**
 * @param {import("#app/delivery/controllers").PreferenceController} preferenceController
 */
export function PreferenceRoutes(preferenceController) {
    const preferenceRouter = express.Router();

    preferenceRouter.post(
        '/users/:userId',
        [
            param('userId')
                .isUUID()
                .withMessage('Некоректний ідентифікатор автора'),
        ],
        handler(preferenceController, 'toggleAuthor'),
    );

    preferenceRouter.post(
        '/posts/:postId',
        [
            param('postId')
                .isUUID()
                .withMessage('Некоректний ідентифікатор поста'),
        ],
        handler(preferenceController, 'togglePost'),
    );

    preferenceRouter.get(
        '/author/blacklist',
        [
            query('take')
                .optional()
                .isInt({ min: 1, max: 100 })
                .withMessage('Кількість елементів має бути числом від 1 до 100')
                .toInt(),
            query('skip')
                .optional()
                .isInt({ min: 0 })
                .withMessage("Пропуск має бути невід'ємним числом")
                .toInt(),
        ],
        handler(preferenceController, 'getAuthorBlacklist'),
    );

    preferenceRouter.get(
        '/post/blacklist',
        [
            query('take')
                .optional()
                .isInt({ min: 1, max: 100 })
                .withMessage('Кількість елементів має бути числом від 1 до 100')
                .toInt(),
            query('skip')
                .optional()
                .isInt({ min: 0 })
                .withMessage("Пропуск має бути невід'ємним числом")
                .toInt(),
        ],
        handler(preferenceController, 'getPostBlacklist'),
    );

    return preferenceRouter;
}
