import { ClientException } from '#app/common/error.js';
import { render } from '#lib/ejs/render.js';
import { validate } from '#lib/validator/validator.js';

import { getAuthToken } from '../common/session.js';

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

export class InteractionController {
    /** @type {import("#app/services").InteractionService} */
    #interactionService;

    /**
     * @param {import("#app/services").InteractionService} interactionService
     */
    constructor(interactionService) {
        this.#interactionService = interactionService;
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async swapStats(req, res) {
        const errors = validate(req);
        if (!errors.isEmpty()) {
            return render(res).template('components/toast.oob', {
                initiator: 'Реакції',
                message: JSON.stringify(errors.mapped()),
                variant: 'danger',
            });
        }

        const withView = req.query.withView === 'true' || false;

        const { postIds } = req.body;
        const interactions = await this.#interactionService.findBatch(postIds);
        return render(res).template('post/components/posts-stats.oob', {
            stats: interactions.stats,
            withView,
        });
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async swapInteractions(req, res) {
        const errors = validate(req);
        if (!errors.isEmpty()) {
            return render(res).template('components/toast.oob', {
                initiator: 'Реакції',
                message: JSON.stringify(errors.mapped()),
                variant: 'danger',
            });
        }

        const withView = req.query.withView === 'true' || false;

        const { postIds } = req.body;
        const interactions = await this.#interactionService.findBatch(postIds);
        return render(res).template('post/components/posts-interaction.oob', {
            stats: interactions.stats,
            withView,
        });
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async swapStates(req, res) {
        const errors = validate(req);
        if (!errors.isEmpty()) {
            return render(res).template('components/toast.oob', {
                initiator: 'Реакції',
                message: JSON.stringify(errors.mapped()),
                variant: 'danger',
            });
        }

        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const { postIds } = req.body;
        const { states } = await this.#interactionService.getBatchStates(
            postIds,
            token,
        );

        return render(res).template('post/components/posts-states.oob', {
            states,
        });
    }
}
