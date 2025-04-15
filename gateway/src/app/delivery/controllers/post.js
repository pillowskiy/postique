import { ClientException } from '#app/common/error.js';
import { CreatePostDTO } from '#app/dto/index.js';
import { requestCookies } from '#lib/rest/cookie.js';
import { validate } from '#lib/validator/validator.js';

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

export class PostController {
    /** @type {import("#app/services").PostService} */
    #postService;

    /**
     * @param {import("#app/services").PostService} postService
     */
    constructor(postService) {
        this.#postService = postService;
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async createPost(req, res) {
        const token = this.#getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const errors = validate(req);
        if (!errors.isEmpty()) {
            throw new ClientException(errors.mapped(), 400);
        }

        const dto = new CreatePostDTO(
            req.body.title,
            req.body.description,
            req.body.content,
            req.body.visibility || 'private',
        );

        const result = await this.#postService.createPost(token, dto);
        return res.status(201).json(result);
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async archivePost(req, res) {
        const token = this.#getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const errors = validate(req);
        if (!errors.isEmpty()) {
            throw new ClientException(errors.mapped(), 400);
        }

        const result = await this.#postService.archivePost(
            req.params.id,
            token,
        );
        return res.status(200).json(result);
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async publishPost(req, res) {
        const token = this.#getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const errors = validate(req);
        if (!errors.isEmpty()) {
            throw new ClientException(errors.mapped(), 400);
        }

        const post = await this.#postService.publishPost(req.params.id, token);
        return res.status(200).json(post);
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async deletePost(req, res) {
        const token = this.#getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const errors = validate(req);
        if (!errors.isEmpty()) {
            throw new ClientException(errors.mapped(), 400);
        }

        const result = await this.#postService.deletePost(req.params.id, token);
        return res.status(200).json(result);
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async changeVisibility(req, res) {
        const token = this.#getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const errors = validate(req);
        if (!errors.isEmpty()) {
            throw new ClientException(errors.mapped(), 400);
        }

        const post = await this.#postService.changePostVisibility(
            req.params.id,
            req.body.visibility,
            token,
        );
        return res.status(200).json(post);
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async saveDelta(req, res) {
        const token = this.#getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const errors = validate(req);
        if (!errors.isEmpty()) {
            throw new ClientException(errors.mapped(), 400);
        }

        const result = await this.#postService.deltaSave(
            req.params.id,
            req.body.deltas,
            token,
        );
        return res.status(200).json(result);
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async transferOwnership(req, res) {
        const token = this.#getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const errors = validate(req);
        if (!errors.isEmpty()) {
            throw new ClientException(errors.mapped(), 400);
        }

        const newOwner = req.body.newOwner;
        if (!newOwner) {
            throw new ClientException(
                'Новий власник повинен бути вказаний',
                400,
            );
        }

        const result = await this.#postService.transferPostOwnership(
            req.params.id,
            newOwner,
            token,
        );
        return res.status(200).json(result);
    }

    /**
     * @param {Request} req
     * @returns {string|null}
     */
    #getAuthToken(req) {
        if (req.token) {
            return req.token;
        }

        const cookies = requestCookies(req);
        return cookies['access_token'] ?? null;
    }
}
