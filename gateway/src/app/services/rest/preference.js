import { RestClient } from './common/client.js';

export class PreferencesService extends RestClient {
    /**
     * @param {import('#shared/config').PostServiceConfig} config
     */
    constructor(config) {
        super(config.postService.address, config.postService.timeout || 5000);
    }

    /**
     * @param {string} authorId
     * @param {string} auth
     * @returns {Promise<import("#app/models").MuteResult>}
     */
    async toggleAuthor(authorId, auth) {
        const response = await this._client
            .patch(`preferences/authors/${authorId}`, {
                headers: this._withAuth(auth),
            })
            .json();

        return this.#muteResultToModel(response);
    }

    /**
     * @param {string} postId
     * @param {string} auth
     * @returns {Promise<import("#app/models").MuteResult>}
     */
    async togglePost(postId, auth) {
        const response = await this._client
            .patch(`preferences/posts/${postId}`, {
                headers: this._withAuth(auth),
            })
            .json();

        return this.#muteResultToModel(response);
    }

    /**
     * @param {number} take
     * @param {number} skip
     * @param {string} auth
     * @returns {Promise<import("#app/models").PreferencePosts>}
     */
    async getPostsBlacklist(take, skip, auth) {
        const response = await this._client
            .get(`preferences/posts`, {
                searchParams: { take, skip },
                headers: this._withAuth(auth),
            })
            .json();

        return this.#paginatedPostsToModel(response);
    }

    /**
     * @param {number} take
     * @param {number} skip
     * @param {string} auth
     * @returns {Promise<import("#app/models").PreferenceUsers>}
     */
    async getAuthorBlacklist(take, skip, auth) {
        const response = await this._client
            .get(`preferences/authors`, {
                searchParams: { take, skip },
                headers: this._withAuth(auth),
            })
            .json();

        return this.#paginatedUsersToModel(response);
    }

    /**
     * @param {Object} data
     * @returns {import("#app/models").MuteResult}
     */
    #muteResultToModel(data) {
        return {
            muted: data.muted,
        };
    }

    /**
     * @param {Object} data
     * @returns {import("#app/models").PreferencePosts}
     */
    #paginatedPostsToModel(data) {
        return {
            items: data.items.map((post) => this.#postToModel(post)),
            total: data.total,
            page: data.page,
            limit: data.limit,
        };
    }

    /**
     * @param {Object} post
     * @returns {import("#app/models").Post}
     */
    #postToModel(post) {
        return {
            id: post.id,
            title: post.title,
            slug: post.slug,
            description: post.description,
            status: post.status,
            visibility: post.visibility,
            coverImage: post.coverImage,
            authors: post.authors,
            owner: post.owner,
            publishedAt: post.publishedAt,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        };
    }

    /**
     * @param {Object} data
     * @returns {import("#app/models").PreferenceUsers}
     */
    #paginatedUsersToModel(data) {
        return {
            items: data.items.map((user) => this.#userToModel(user)),
            total: data.total,
            page: data.page,
            limit: data.limit,
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
