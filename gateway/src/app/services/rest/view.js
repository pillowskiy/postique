import { RestClient } from './common/client.js';

export class ViewService extends RestClient {
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
     * @param {Object} viewData
     * @param {string|null} auth
     * @returns {Promise<void>}
     */
    async registerView(targetId, viewData, auth = null) {
        await this._client
            .post(`views/${targetId}`, {
                json: {
                    readPercentage: viewData.readPercentage,
                    readingTime: viewData.readingTime,
                    referrer: viewData.referrer,
                    userAgent: viewData.userAgent,
                },
                headers: this._withAuth(auth),
            })
            .json();
    }
}
