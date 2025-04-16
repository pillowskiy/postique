import ky from 'ky';

/**
 * @typedef {import('#shared/config').PostServiceConfig} PostServiceConfig
 */

export class PostService {
    /** @type {import('ky').KyInstance} */
    #client;

    /**
     * @param {PostServiceConfig} config
     */
    constructor(config) {
        this.#client = ky.create({
            prefixUrl: config.postService.address,
            timeout: config.postService.timeout || 5000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    /**
     * @param {string} auth
     * @param {import("#app/dto").CreatePostDTO} input
     * @returns {Promise<import("#app/models").PostIdentifier>}
     */
    async createPost(auth, input) {
        const response = await this.#client
            .post('posts', {
                json: input,
                headers: this.#withAuth(auth),
            })
            .json();

        return this.#postIdentifierToModel(response);
    }

    /**
     * @param {string} postId
     * @param {string} visibility
     * @param {string} auth
     * @returns {Promise<import("#app/models").Post>}
     */
    async changePostVisibility(postId, visibility, auth) {
        const response = await this.#client
            .patch(`posts/${postId}/visibility`, {
                json: { visibility },
                headers: this.#withAuth(auth),
            })
            .json();

        return this.#postToModel(response);
    }

    /**
     * @param {string} postId
     * @param {string} auth
     * @returns {Promise<import("#app/models").PostIdentifier>}
     */
    async archivePost(postId, auth) {
        const response = await this.#client
            .patch(`posts/${postId}/archive`, {
                headers: this.#withAuth(auth),
            })
            .json();

        return this.#postIdentifierToModel(response);
    }

    /**
     * @param {string} postId
     * @param {string} auth
     * @returns {Promise<import("#app/models").Post>}
     */
    async publishPost(postId, auth) {
        const response = await this.#client
            .patch(`posts/${postId}/publish`, {
                headers: this.#withAuth(auth),
            })
            .json();

        return this.#postToModel(response);
    }

    /**
     * @param {string} postId
     * @param {string} auth
     * @returns {Promise<import("#app/models").PostIdentifier>}
     */
    async deletePost(postId, auth) {
        const response = await this.#client
            .delete(`posts/${postId}`, {
                headers: this.#withAuth(auth),
            })
            .json();

        return this.#postIdentifierToModel(response);
    }

    /**
     * @param {string} postId
     * @param {string} newOwner
     * @param {string} auth
     * @returns {Promise<import("#app/models").PostIdentifier>}
     */
    async transferPostOwnership(postId, newOwner, auth) {
        const response = await this.#client
            .patch(`posts/${postId}/transfer`, {
                json: { newOwner },
                headers: this.#withAuth(auth),
            })
            .json();

        return this.#postIdentifierToModel(response);
    }

    /**
     * @param {string} postId
     * @param {Array<Object>} deltas
     * @param {string} auth
     * @returns {Promise<import("#app/models").PostIdentifier>}
     */
    async deltaSave(postId, deltas, auth) {
        const response = await this.#client
            .patch(`posts/${postId}/delta`, {
                json: { deltas },
                headers: this.#withAuth(auth),
            })
            .json()
            .catch((err) => {
                console.log(err, deltas);
                throw err;
            });

        return this.#postIdentifierToModel(response);
    }

    /**
     * @param {string|null} auth
     * @param {number} take
     * @param {string|null} cursor
     * @returns {Promise<import("#app/models").PostCursor>}
     */
    async getPosts(auth, take, cursor) {
        const params = new URLSearchParams();
        if (take) params.set('take', take.toString());
        if (cursor) params.set('cursor', cursor);

        const response = await this.#client
            .get(`posts/cursor?${params}`, {
                headers: this.#withAuth(auth),
            })
            .json();

        return this.#postCursorToModel(response);
    }

    /**
     * @param {string} slug
     * @returns {Promise<import("#app/models").Post>}
     */
    async getPost(slug) {
        const response = await this.#client.get(`posts/${slug}`).json();
        return this.#postToModel(response);
    }

    /**
     * @param {string} status
     * @param {number} take
     * @param {number} skip
     * @returns {Promise<Array<import("#app/models").Post>>}
     */
    async getPostsByStatus(status, take, skip) {
        const params = new URLSearchParams();
        if (take) params.set('take', take.toString());
        if (skip) params.set('skip', skip.toString());

        const response = await this.#client
            .get(`posts/status/${status}?${params}`)
            .json();
        return response.map((post) => this.#postToModel(post));
    }

    /**
     * @param {Object} post
     * @returns {import("#app/models").Post}
     */
    #postToModel(post) {
        return {
            id: post.id,
            title: post.title,
            description: post.description,
            visibility: post.visibility,
            owner: post.owner,
            authors: post.authors,
            slug: post.slug,
            status: post.status,
            publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
            createdAt: new Date(post.createdAt),
            updatedAt: new Date(post.updatedAt),
            paragraphs:
                post.paragraphs?.map((p) => this.#paragraphToModel(p)) || [],
        };
    }

    /**
     * @param {Object} paragraph
     * @returns {import("#app/models").PostParagraph}
     */
    #paragraphToModel(paragraph) {
        return {
            name: paragraph.name,
            type: paragraph.type,
            text: paragraph.text,
            markups:
                paragraph.markups?.map((m) => this.#markupToModel(m)) || [],
            metadata: paragraph.metadata
                ? this.#imageMetadataToModel(paragraph.metadata)
                : undefined,
            codeMetadata: paragraph.codeMetadata
                ? this.#codeMetadataToModel(paragraph.codeMetadata)
                : undefined,
        };
    }

    /**
     * @param {Object} markup
     * @returns {import("#app/models").PostMarkup}
     */
    #markupToModel(markup) {
        return {
            type: markup.type,
            start: markup.start,
            end: markup.end,
            href: markup.href,
        };
    }

    /**
     * @param {Object} metadata
     * @returns {import("#app/models").ImageMetadata}
     */
    #imageMetadataToModel(metadata) {
        return {
            src: metadata.src,
            originalWidth: metadata.originalWidth,
            originalHeight: metadata.originalHeight,
        };
    }

    /**
     * @param {Object} metadata
     * @returns {import("#app/models").CodeMetadata}
     */
    #codeMetadataToModel(metadata) {
        return {
            language: metadata.language,
            spellcheck: metadata.spellcheck,
        };
    }

    /**
     * @param {Object} data
     * @returns {import("#app/models").PostCursor}
     */
    #postCursorToModel(data) {
        return {
            items: data.items.map((post) => this.#postToModel(post)),
            cursorField: data.cursorField,
            size: data.size,
        };
    }

    /**
     * @param {Object} data
     * @returns {import("#app/models").PostIdentifier}
     */
    #postIdentifierToModel(data) {
        return {
            postId: data.postId,
        };
    }

    /**
     * @param {string | null} auth
     * @param {Object} headers
     * @returns {Object}
     */
    #withAuth(auth, headers = {}) {
        if (!auth) return headers;

        return {
            ...headers,
            Authorization: `Bearer ${auth}`,
        };
    }
}
