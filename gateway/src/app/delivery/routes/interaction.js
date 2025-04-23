import express from 'express';
import { body } from 'express-validator';

import handler from '../common/handler.js';

/**
 * @param {import("#app/delivery/controllers").InteractionController} interactionController
 */
export function InteractionRoutes(interactionController) {
    const interactionRouter = express.Router();

    interactionRouter.post(
        '/batch',
        [body('postIds').isArray().isLength({ min: 1 })],
        handler(interactionController, 'swapInteractions'),
    );

    interactionRouter.post(
        '/states',
        [body('postIds').isArray().isLength({ min: 1 })],
        handler(interactionController, 'swapStates'),
    );

    return interactionRouter;
}
