import { RestClient } from './common/client.js';

export class CollectionService extends RestClient {
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
     * @param {string} name
     * @param {string} auth
     * @param {string|undefined} description
     * @returns {Promise<import("#app/models").CollectionIdentifier>}
     */
    async createCollection(name, auth, description) {
        const response = await this._client
            .post('collcetions', {
                json: { userId: '', name, description },
                headers: this._withAuth(auth),
            })
            .json();

        return this.#collectionIdentifierToModel(response);
    }

    /**
     * @param {string} collectionId
     * @param {string} auth
     * @returns {Promise<import("#app/models").CollectionIdentifier>}
     */
    async deleteCollection(collectionId, auth) {
        const response = await this._client
            .delete(`collcetions/${collectionId}`, {
                headers: this._withAuth(auth),
            })
            .json();

        return this.#collectionIdentifierToModel(response);
    }

    /**
     * @param {string} collectionId
     * @param {string} auth
     * @param {string|null} cursor
     * @param {number|null} pageSize
     * @returns {Promise<import("#app/models").BookmarkCursor>}
     */
    async getCollectionBookmarks(collectionId, auth, cursor, pageSize) {
        const params = new URLSearchParams();
        if (cursor) params.set('cursor', cursor);
        if (pageSize) params.set('pageSize', pageSize.toString());

        const response = await this._client
            .get(`collcetions/${collectionId}/bookmarks?${params}`, {
                headers: this._withAuth(auth),
            })
            .json();

        return this.#bookmarkCursorToModel(response);
    }

    /**
     * @param {string} userId
     * @param {string} auth
     * @returns {Promise<import("#app/models").DetailedCollection[]>}
     */
    async getUserCollections(userId, auth) {
        const response = await this._client
            .get(`collcetions/users/${userId}`, {
                headers: this._withAuth(auth),
            })
            .json();

        return response.map((collection) =>
            this.#detailedCollectionToModel(collection),
        );
    }

    /**
     * @param {Object} data
     * @returns {import("#app/models").CollectionIdentifier}
     */
    #collectionIdentifierToModel(data) {
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

    /**
     * @param {Object} collection
     * @returns {import("#app/models").DetailedCollection}
     */
    #detailedCollectionToModel(collection) {
        return {
            id: collection.id,
            userId: collection.userId,
            name: collection.name,
            description: collection.description,
            createdAt: new Date(collection.createdAt),
            updatedAt: new Date(collection.updatedAt),
            bookmarksCount: collection.bookmarksCount || 0,
            author: collection.author
                ? this.#userToModel(collection.author)
                : undefined,
        };
    }

    /**
     * @param {Object} user
     * @returns {import("#app/models").User}
     */
    #userToModel(user) {
        return {
            id: user.id,
            username: user.username,
            avatarUrl: user.avatarPath,
        };
    }
}
