import { ClientException } from '#app/common/error.js';
import { render } from '#lib/ejs/render.js';
import { validate } from '#lib/validator/validator.js';

import { getAuthToken } from '../common/session.js';

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

export class CommentController {
    /** @type {import("#app/services").CommentService} */
    #commentService;

    /**
     * @param {import("#app/services").CommentService} commentService
     */
    constructor(commentService) {
        this.#commentService = commentService;
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async createComment(req, res) {
        const errors = validate(req);
        if (!errors.isEmpty()) {
            return render(res).template('components/toast.oob', {
                initiator: 'Коментарі',
                message: JSON.stringify(errors.mapped()),
                variant: 'danger',
            });
        }

        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const { postId } = req.params;
        const { content, parentId } = req.body;

        await this.#commentService.createComment(
            postId,
            content,
            parentId,
            token,
        );

        return render(res).template('components/toast.oob', {
            initiator: 'Коментарі',
            message: 'Коментар успішно створено',
            variant: 'success',
        });
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async deleteComment(req, res) {
        const errors = validate(req);
        if (!errors.isEmpty()) {
            return render(res).template('components/toast.oob', {
                initiator: 'Коментарі',
                message: JSON.stringify(errors.mapped()),
                variant: 'danger',
            });
        }

        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const { commentId } = req.params;

        await this.#commentService.deleteComment(commentId, token);

        return render(res).template('components/toast.oob', {
            initiator: 'Коментарі',
            message: 'Коментар успішно видалено',
            variant: 'success',
        });
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async getPostComments(req, res) {
        const errors = validate(req);
        if (!errors.isEmpty()) {
            return render(res).template('components/toast.oob', {
                initiator: 'Коментарі',
                message: JSON.stringify(errors.mapped()),
                variant: 'danger',
            });
        }

        const token = getAuthToken(req);
        const { postId } = req.params;
        const { cursor, pageSize } = req.query;

        const comments = await this.#commentService.getPostComments(
            postId,
            token,
            cursor,
            pageSize ? parseInt(pageSize) : 10,
        );

        return render(res).template('comment/post-comments.oob', {
            comments: comments.items,
            postId,
            user: req.user,
            cursor: comments.cursorField,
        });
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async getCommentReplies(req, res) {
        const errors = validate(req);
        if (!errors.isEmpty()) {
            return render(res).template('components/toast.oob', {
                initiator: 'Коментарі',
                message: JSON.stringify(errors.mapped()),
                variant: 'danger',
            });
        }

        const token = getAuthToken(req);
        const { commentId } = req.params;
        const { cursor, pageSize } = req.query;

        const replies = await this.#commentService.getCommentReplies(
            commentId,
            token,
            cursor,
            pageSize ? parseInt(pageSize) : 5,
        );

        return render(res).template('comment/comment-replies.oob', {
            replies: replies.items,
            commentId,
            user: req.user,
            cursor: replies.cursorField,
        });
    }
}
