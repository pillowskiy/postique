import { ClientException } from '#app/common/error.js';
import {
    CreatePostDTO,
    DeleteFileDTO,
    UpdatePostMetadataDTO,
} from '#app/dto/index.js';
import { render } from '#lib/ejs/render.js';
import { validate } from '#lib/validator/validator.js';

import { getAuthToken } from '../common/session.js';

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

export class PostController {
    /** @type {import("#app/services").PostService} */
    #postService;

    /** @type {import("#app/services").FileService} */
    #fileService;

    /**
     * @param {import("#app/services").PostService} postService
     * @param {import("#app/services").FileService} fileService
     */
    constructor(postService, fileService) {
        this.#postService = postService;
        this.#fileService = fileService;
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async getNewStoryView(req, res) {
        return render(res)
            .template('workbench/workbench-page', {})
            .layout('workbench/workbench-layout');
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async createPost(req, res) {
        const token = getAuthToken(req);
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
            req.body.visibility,
        );

        const result = await this.#postService.createPost(token, dto);
        return res.status(201).json(result);
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async archivePost(req, res) {
        const token = getAuthToken(req);
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
        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const errors = validate(req);
        if (!errors.isEmpty()) {
            throw new ClientException(errors.mapped(), 400);
        }

        const dto = new UpdatePostMetadataDTO({
            title: req.body.title,
            description: req.body.description,
            coverImage: req.file?.filename,
        });

        /** @type {Promise<any>[]} */
        const promises = [
            this.#postService
                .publishPost(req.params.id, dto, token)
                .catch((e) => {
                    if (req.file) {
                        this.#fileService
                            .delete(new DeleteFileDTO(req.file.filename))
                            .catch(() => null);
                    }
                    throw e;
                }),
        ];

        if (req.file) {
            promises.push(this.#fileService.upload(req.file));
        }

        await Promise.all(promises);

        return render(res).template('components/toast.oob', {
            initiator: 'Редакція',
            message: 'Публікація вашого посту завершена успішно',
            variant: 'success',
        });
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async deletePost(req, res) {
        const token = getAuthToken(req);
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
        const token = getAuthToken(req);
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
        const token = getAuthToken(req);
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
        const token = getAuthToken(req);
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
     * @param {Response} res
     */
    async getPostInfo(req, res) {
        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const errors = validate(req);
        if (!errors.isEmpty()) {
            throw new ClientException(errors.mapped(), 400);
        }

        const result = await this.#postService.getPostInfo(
            req.params.id,
            token,
        );
        return res.status(200).json(result);
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async getPostDraft(req, res) {
        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('Ви повинні бути авторизовані', 401);
        }

        const errors = validate(req);
        if (!errors.isEmpty()) {
            throw new ClientException(errors.mapped(), 400);
        }

        const result = await this.#postService.getPostDraft(
            req.params.id,
            token,
        );
        return res.status(200).json(result);
    }
}
