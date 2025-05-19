import { ClientException } from '#app/common/error.js';
import { validate } from '#lib/validator/validator.js';

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

export class FileController {
    /** @type {import("#app/services").FileService} */
    #fileService;

    /**
     * @param {import("#app/services").FileService} fileService
     */
    constructor(fileService) {
        this.#fileService = fileService;
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async upload(req, res) {
        if (!req.file) {
            throw new ClientException('Файл не знайдено', 400);
        }

        const errors = validate(req);
        if (!errors.isEmpty()) {
            throw new ClientException(errors.mapped(), 400);
        }

        await this.#fileService.upload(req.file);

        return res
            .json({
                path: req.file.filename,
            })
            .status(201);
    }
}
