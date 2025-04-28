import express from 'express';
import { body } from 'express-validator';

import handler from '../common/handler.js';

/**
 * @param {import("#app/delivery/controllers").InteractionController} interactionController
 */
export function InteractionRoutes(interactionController) {
    const interactionRouter = express.Router();

    interactionRouter.post(
        '/stats',
        [
            body('postIds')
                .customSanitizer((v) => (typeof v === 'string' ? [v] : v))
                .isArray()
                .isLength({ min: 1 }),
        ],
        handler(interactionController, 'swapStats'),
    );

    interactionRouter.post(
        '/istats',
        [
            body('postIds')
                .customSanitizer((v) => (typeof v === 'string' ? [v] : v))
                .isArray()
                .isLength({ min: 1 }),
        ],
        handler(interactionController, 'swapInteractions'),
    );

    interactionRouter.post(
        '/states',
        [
            body('postIds')
                .customSanitizer((v) => (typeof v === 'string' ? [v] : v))
                .isArray()
                .isLength({ min: 1 }),
        ],
        handler(interactionController, 'swapStates'),
    );

    return interactionRouter;
}
