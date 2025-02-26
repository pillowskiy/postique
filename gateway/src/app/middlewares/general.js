import { ClientException } from '#app/common/error.js';
import { render } from '#lib/ejs/render.js';

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
                });
        }
    }
}
