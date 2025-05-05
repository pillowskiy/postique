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
     * @param {string} auth
     * @param {string} name
     * @param {string|undefined} description
     * @returns {Promise<import("#app/models").Collection>}
     */
    async createCollection(auth, name, description) {
        const response = await this._client
            .post('collections', {
                json: { userId: '', name, description },
                headers: this._withAuth(auth),
            })
            .json();

        return this.#collectionToModel(response);
    }

    /**
     * @param {string} collectionId
     * @param {string} auth
     * @returns {Promise<import("#app/models").CollectionIdentifier>}
     */
    async deleteCollection(collectionId, auth) {
        const response = await this._client
            .delete(`collections/${collectionId}`, {
                headers: this._withAuth(auth),
            })
            .json();

        return this.#collectionIdentifierToModel(response);
    }

    /**
     * @param {string} slug
     * @param {string|null} auth
     * @returns {Promise<import("#app/models").DetailedCollection>}
     */
    async getDetailedCollection(slug, auth) {
        const response = await this._client
            .get(`collections/${slug}`, {
                headers: this._withAuth(auth),
            })
            .json();

        return this.#detailedCollectionToModel(response);
    }

    /**
     * @param {string} userId
     * @param {string} auth
     * @returns {Promise<import("#app/models").DetailedCollection[]>}
     */
    async getUserCollections(userId, auth) {
        const response = await this._client
            .get(`collections/users/${userId}`, {
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
     * @param {Object} collection
     * @returns {import("#app/models").DetailedCollection}
     */
    #detailedCollectionToModel(collection) {
        return {
            ...this.#collectionToModel(collection),
            bookmarksCount: collection.bookmarksCount || 0,
            author: collection.author
                ? this.#userToModel(collection.author)
                : undefined,
        };
    }

    /**
     * @param {Object} collection
     * @returns {import("#app/models").Collection}
     */
    #collectionToModel(collection) {
        return {
            id: collection.id,
            userId: collection.userId,
            name: collection.name,
            slug: collection.slug,
            description: collection.description,
            createdAt: new Date(collection.createdAt),
            updatedAt: new Date(collection.updatedAt),
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
