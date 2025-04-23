import { RestClient } from './common/client.js';

export class LikeService extends RestClient {
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
     * @param {string} targetId
     * @param {string} auth
     * @returns {Promise<import("#app/models").ToggleLikeResult>}
     */
    async toggleLike(targetId, auth) {
        const response = await this._client
            .post(`likes/${targetId}`, {
                headers: this._withAuth(auth),
            })
            .json();

        return this.#toggleLikeToModel(response);
    }

    /**
     * @param {Object} data
     * @returns {import("#app/models").ToggleLikeResult}
     */
    #toggleLikeToModel(data) {
        return {
            isLiked: data.isLiked,
        };
    }
}
