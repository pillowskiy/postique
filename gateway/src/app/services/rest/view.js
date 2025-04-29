import { warn } from 'console';

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
     * @param {string|null} auth
     * @returns {Promise<void>}
     */
    async registerView(targetId, auth = null) {
        await this._client
            .post(`views/${targetId}`, {
                json: {},
                headers: this._withAuth(auth),
            })
            .json();
    }

    /**
     * @param {string} auth
     * @param {string|null} cursor
     * @param {number|null} pageSize
     * @returns {Promise<import("#app/models").ViewCursor>}
     */
    async getUserHistory(auth, cursor, pageSize) {
        const params = new URLSearchParams();
        if (cursor) params.set('cursor', cursor);
        if (pageSize) params.set('pageSize', pageSize.toString());

        const response = await this._client
            .get(`views/history?${params}`, {
                headers: this._withAuth(auth),
            })
            .json();

        return this.#viewCursorToModel(response);
    }

    /**
     * @param {string} auth
     * @returns {Promise<void>}
     */
    async clearHistory(auth) {
        await this._client
            .delete(`views/history`, {
                headers: this._withAuth(auth),
            })
            .json();
    }

    /**
     * @param {string} auth
     * @param {string} targetId
     * @returns {Promise<void>}
     */
    async removeView(auth, targetId) {
        await this._client
            .delete(`views/${targetId}`, {
                headers: this._withAuth(auth),
            })
            .json();
    }

    /**
     * @param {Object} data
     * @returns {import("#app/models").ViewCursor}
     */
    #viewCursorToModel(data) {
        return {
            items: data.items.map((view) => this.#viewToModel(view)),
            cursorField: data.cursorField,
            size: data.size,
        };
    }

    /**
     * @param {Object} data
     * @returns {import("#app/models").View}
     */
    #viewToModel(data) {
        return {
            userId: data.userId,
            targetId: data.targetId,
            readPercentage: data.readPercentage,
            readingTime: data.readingTime,
            referrer: data.referrer,
            userAgent: data.userAgent,
            createdAt: new Date(data.createdAt),
        };
    }
}
