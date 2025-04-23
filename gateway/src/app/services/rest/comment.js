import { RestClient } from './common/client.js';

export class CommentService extends RestClient {
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
     * @param {string} postId
     * @param {string} content
     * @param {string} auth
     * @returns {Promise<import("#app/models").CommentIdentifier>}
     */
    async createComment(postId, content, auth) {
        const response = await this._client
            .post('comments', {
                json: { userId: '', postId, content },
                headers: this._withAuth(auth),
            })
            .json();

        return this.#commentIdentifierToModel(response);
    }

    /**
     * @param {string} commentId
     * @param {string} auth
     * @returns {Promise<import("#app/models").CommentIdentifier>}
     */
    async deleteComment(commentId, auth) {
        const response = await this._client
            .delete(`comments/${commentId}`, {
                headers: this._withAuth(auth),
            })
            .json();

        return this.#commentIdentifierToModel(response);
    }

    /**
     * @param {string} commentId
     * @param {string} content
     * @param {string} auth
     * @returns {Promise<import("#app/models").EditedComment>}
     */
    async editComment(commentId, content, auth) {
        const response = await this._client
            .patch(`comments/${commentId}`, {
                json: { content },
                headers: this._withAuth(auth),
            })
            .json();

        return this.#editedCommentToModel(response);
    }

    /**
     * @param {string} postId
     * @param {string} auth
     * @param {string|null} cursor
     * @param {number|null} pageSize
     * @returns {Promise<import("#app/models").CommentCursor>}
     */
    async getPostComments(postId, auth, cursor, pageSize) {
        const params = new URLSearchParams();
        if (cursor) params.set('cursor', cursor);
        if (pageSize) params.set('pageSize', pageSize.toString());

        const response = await this._client
            .get(`comments/posts/${postId}?${params}`, {
                headers: this._withAuth(auth),
            })
            .json();

        return this.#commentCursorToModel(response);
    }

    /**
     * @param {string} commentId
     * @param {string} auth
     * @param {string|null} cursor
     * @param {number|null} pageSize
     * @returns {Promise<import("#app/models").CommentCursor>}
     */
    async getCommentReplies(commentId, auth, cursor, pageSize) {
        const params = new URLSearchParams();
        if (cursor) params.set('cursor', cursor);
        if (pageSize) params.set('pageSize', pageSize.toString());

        const response = await this._client
            .get(`comments/${commentId}/replies?${params}`, {
                headers: this._withAuth(auth),
            })
            .json();

        return this.#commentCursorToModel(response);
    }

    /**
     * @param {Object} data
     * @returns {import("#app/models").CommentIdentifier}
     */
    #commentIdentifierToModel(data) {
        return {
            id: data.id,
        };
    }

    /**
     * @param {Object} data
     * @returns {import("#app/models").EditedComment}
     */
    #editedCommentToModel(data) {
        return {
            id: data.id,
            content: data.content,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
        };
    }

    /**
     * @param {Object} data
     * @returns {import("#app/models").CommentCursor}
     */
    #commentCursorToModel(data) {
        return {
            items: data.items.map((comment) =>
                this.#detailedCommentToModel(comment),
            ),
            cursorField: data.cursorField,
            size: data.size,
        };
    }

    /**
     * @param {Object} comment
     * @returns {import("#app/models").DetailedComment}
     */
    #detailedCommentToModel(comment) {
        return {
            id: comment.id,
            userId: comment.userId,
            postId: comment.postId,
            content: comment.content,
            author: this.#userToModel(comment.author),
            createdAt: new Date(comment.createdAt),
            updatedAt: new Date(comment.updatedAt),
            parentId: comment.parentId,
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
