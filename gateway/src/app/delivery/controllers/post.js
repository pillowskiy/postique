import { ClientException } from '#app/common/error.js';
import {
    CreatePostDTO,
    DeleteFileDTO,
    UpdatePostMetadataDTO,
} from '#app/dto/index.js';
import { ParagraphType, PostContentRenderer } from '#lib/ejs/post.js';
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

    /** @type {import("#app/services").ViewService} */
    #viewService;

    /** @type {import("#app/services").FileService} */
    #fileService;

    /**
     * @param {import("#app/services").PostService} postService
     * @param {import("#app/services").FileService} fileService
     * @param {import("#app/services").ViewService} viewService
     */
    constructor(postService, fileService, viewService) {
        this.#postService = postService;
        this.#fileService = fileService;
        this.#viewService = viewService;
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
    async getPostView(req, res) {
        const token = getAuthToken(req);
        if (!token) {
            throw new ClientException('You should be logged in', 401);
        }

        const errors = validate(req);
        if (!errors.isEmpty()) {
            throw new ClientException(errors.mapped(), 400);
        }

        const { slug } = req.params;
        const post = await this.#postService.getPost(slug);
        const content = await this.#postService.getPostDraft(post.id, token);

        const titleIndex = content.findIndex(
            (p) => p.type === ParagraphType.Title,
        );
        if (titleIndex !== -1) {
            content.splice(titleIndex, 1);
        }

        if (token) {
            this.#viewService.registerView(post.id, token).catch((err) => {
                console.log(err);
            });
        }

        return render(res).template('post/post-page', {
            post,
            paragraphs: content,
            renderer: new PostContentRenderer(),
        });
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async getPopularPartialPostsView(req, res) {
        const cursor = req.query.cursor ?? null;
        const take = req.query.take ?? 3;
        const token = getAuthToken(req);

        const data = await this.#postService.getPosts(token, take, cursor);

        return render(res).template('post/post-aside-card-list.swap', {
            posts: data.items,
        });
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

        await this.#postService.archivePost(req.params.id, token);

        return render(res).template('components/toast.oob', {
            initiator: 'Публікатор',
            message: 'Вашу публікацію архівовано успішно',
            variant: 'success',
        });
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

        await this.#postService.deletePost(req.params.id, token);
        return render(res).template('components/toast.oob', {
            initiator: 'Публікатор',
            message: 'Ваша публікація видалена успішно',
            variant: 'success',
        });
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

        await this.#postService.changePostVisibility(
            req.params.id,
            req.body.visibility,
            token,
        );

        return render(res).template('components/toast.oob', {
            initiator: 'Публікатор',
            message: 'Зміна видимості посту завершена успішно',
            variant: 'success',
        });
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
