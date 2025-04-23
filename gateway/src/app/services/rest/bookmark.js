import { RestClient } from './common/client.js';

export class BookmarkService extends RestClient {
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
     * @param {string} auth
     * @param {string} targetId
     * @param {string|undefined} collectionId
     * @returns {Promise<import("#app/models").BookmarkIdentifier>}
     */
    async addBookmark(auth, targetId, collectionId) {
        const response = await this._client
            .post('bookmarks', {
                json: { userId: '', targetId, collectionId },
                headers: this._withAuth(auth),
            })
            .json();

        return this.#bookmarkIdentifierToModel(response);
    }

    /**
     * @param {string} targetId
     * @param {string} auth
     * @returns {Promise<import("#app/models").BookmarkIdentifier>}
     */
    async deleteBookmark(targetId, auth) {
        const response = await this._client
            .delete(`bookmarks/${targetId}`, {
                headers: this._withAuth(auth),
            })
            .json();

        return this.#bookmarkIdentifierToModel(response);
    }

    /**
     * @param {string} userId
     * @param {string} auth
     * @param {string|null} cursor
     * @param {number|null} pageSize
     * @returns {Promise<import("#app/models").BookmarkCursor>}
     */
    async getUserBookmarks(userId, auth, cursor, pageSize) {
        const params = new URLSearchParams();
        if (cursor) params.set('cursor', cursor);
        if (pageSize) params.set('pageSize', pageSize.toString());

        const response = await this._client
            .get(`bookmarks/users/${userId}?${params}`, {
                headers: this._withAuth(auth),
            })
            .json();

        return this.#bookmarkCursorToModel(response);
    }

    /**
     * @param {Object} data
     * @returns {import("#app/models").BookmarkIdentifier}
     */
    #bookmarkIdentifierToModel(data) {
        return {
            id: data.id,
        };
    }

    /**
     * @param {Object} data
     * @returns {import("#app/models").BookmarkCursor}
     */
    #bookmarkCursorToModel(data) {
        return {
            items: data.items.map((bookmark) =>
                this.#detailedBookmarkToModel(bookmark),
            ),
            cursorField: data.cursorField,
            size: data.size,
        };
    }

    /**
     * @param {Object} bookmark
     * @returns {import("#app/models").DetailedBookmark}
     */
    #detailedBookmarkToModel(bookmark) {
        return {
            id: bookmark.id,
            userId: bookmark.userId,
            targetId: bookmark.targetId,
            post: this.#postToModel(bookmark.post),
            collectionId: bookmark.collectionId,
            createdAt: bookmark.createdAt
                ? new Date(bookmark.createdAt)
                : undefined,
            updatedAt: bookmark.updatedAt
                ? new Date(bookmark.updatedAt)
                : undefined,
        };
    }

    /**
     * @param {Object} post
     * @returns {import("#app/models").PartialPost}
     */
    #postToModel(post) {
        return {
            id: post.id,
            title: post.title,
            description: post.description,
            coverImage: post.coverImage,
        };
    }
}
