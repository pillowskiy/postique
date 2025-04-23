import { RestClient } from './common/client.js';

export class InteractionService extends RestClient {
    /**
     * @param {import('#shared/config').ReactionServiceConfig} config
     */
    constructor(config) {
        super(
            config.reactionService.address,
            config.reactionService.timeout || 5000,
        );
    }

    /**
     * @param {string[]} postIds
     * @returns {Promise<import("#app/models").BatchInteractions>}
     */
    async findBatch(postIds) {
        const response = await this._client
            .post('interactions/batch', {
                json: { postIds },
            })
            .json();

        return this.#batchInteractionsToModel(response);
    }

    /**
     * @param {string[]} postIds
     * @param {string} auth
     * @returns {Promise<import("#app/models").PostInteractionStates>}
     */
    async getBatchStates(postIds, auth) {
        const response = await this._client
            .post('interactions/stats', {
                json: { postIds },
                headers: this._withAuth(auth),
            })
            .json();

        return this.#interactionStatesToModel(response);
    }

    /**
     * @param {Object} data
     * @returns {import("#app/models").PostInteractionStates}
     */
    #interactionStatesToModel(data) {
        return {
            states: data.stats.map((s) => this.#statesToModel(s)),
        };
    }

    /**
     * @param {Object} data
     * @returns {import("#app/models").StatesItem}
     */
    #statesToModel(data) {
        return {
            postId: data.postId,
            liked: data.liked,
            saved: data.saved,
            collectionId: data.collectionId,
        };
    }

    /**
     * @param {Object} data
     * @returns {import("#app/models").BatchInteractions}
     */
    #batchInteractionsToModel(data) {
        return {
            stats: data.stats.map((s) => this.#statToModel(s)),
        };
    }

    /**
     * @param {Object} stat
     * @returns {import("#app/models").StatItem}
     */
    #statToModel(stat) {
        return {
            postId: stat.postId,
            likesCount: stat.likesCount,
            bookmarksCount: stat.bookmarksCount,
            commentsCount: stat.commentsCount,
            viewsCount: stat.viewsCount,
        };
    }
}
