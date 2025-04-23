import { ClientException } from '#app/common/error.js';
import { UploadFileDTO } from '#app/dto/index.js';
import { render } from '#lib/ejs/render.js';

import multer from 'multer';
import { extname } from 'path';

export class GeneralMiddlewares {
    /** @type {import('#shared/logger').Logger} */
    #logger;

    /**
     * @param {import('#shared/logger').Logger} logger
     */
    constructor(logger) {
        this.#logger = logger;
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    async responseResult(req, res, next) {
        const start = Date.now();

        res.on('finish', () => {
            const duration = `${Date.now() - start}ms`;
            const { method, url } = req;
            const { statusCode, statusMessage } = res;

            this.#logger.debug(
                {
                    method,
                    url,
                    statusCode,
                    statusMessage,
                    duration,
                },
                'Request processed',
            );
        });

        next();
    }

    /**
     * @param {Error} err
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} _
     */
    async exception(err, req, res, _) {
        if (err instanceof Error) {
            this.#logger.error(
                {
                    message: err.message,
                    details: err,
                },
                'The following error has been catched',
            );
        }

        const exception = ClientException.fromError(err);
        this.#logger.debug(
            {
                message: exception.message,
                status: exception.status,
                details: exception.details,
                requestMethod: req.method,
            },
            'Exception has been catched',
        );

        res.setHeader('X-Error-Message', btoa(exception.message));
        res.setHeader('X-Error-Code', btoa(exception.name));
        switch (req.method) {
            case 'GET':
                return render(res).template('shared/error', {
                    message: exception.message,
                    status: exception.status,
                    title: 'Oops! Something went wrong',
                });
            default:
                return render(res).template('components/toast.oob', {
                    initiator: 'Postique',
                    message: exception.message,
                    variant: 'danger',
                });
        }
    }

    /**
     * @param {Object} [options]
     * @property {boolean} [allowEmpty]
     * @property {number} [maxFileSize]
     * @property {boolean} [optional]
     */
    singleFile(options = {}) {
        const { maxFileSize = 1024 * 1024 * 20, optional = false } = options;

        const storage = multer.memoryStorage();
        const upload = multer({
            storage,
            limits: { fileSize: maxFileSize },
        }).single('file');

        /**
         * @param {import('express').Request} req
         * @param {import('express').Response} res
         * @param {import('express').NextFunction} next
         */
        return (req, res, next) => {
            this.#logger.debug?.('Parsing form');

            upload(req, res, (err) => {
                if (err) {
                    this.#logger.error(err, 'Error while parsing form');
                    return next(
                        new ClientException('Помилка обробки файлу', 500),
                    );
                }

                const file = req.file;
                if (!file) {
                    if (optional) {
                        return next();
                    }

                    return next(
                        new ClientException(
                            'Файлу для завантаження не було вказано',
                            400,
                        ),
                    );
                }

                if (!file.mimetype) {
                    return next(
                        new ClientException(
                            'Не вдалося отримати тип файлу',
                            400,
                        ),
                    );
                }

                req.file = new UploadFileDTO(
                    `${crypto.randomUUID()}${extname(file.originalname)}`,
                    file.buffer,
                    file.mimetype,
                );
                this.#logger.debug?.(
                    {
                        uploadedFile: {
                            contentType: req.file.contentType,
                            filename: req.file.filename,
                        },
                    },
                    'Uploaded file',
                );

                return next();
            });
        };
    }
}
