import { ejsView } from '#lib/ejs/render.js';

import express from 'express';

/** @typedef {import('./logger/index.js').Logger} Logger */
/** @typedef {import('./config/index.js').AppConfig} AppConfig */

export default class Server {
    /** @type {express.Express} */
    #instance;

    /** @type {import('http').Server | null} */
    #http = null;

    /** @type {Logger} */
    #logger;

    /** @type {AppConfig} */
    #config;

    /**
     * @param {express.Router} router
     * @param {Logger} logger,
     * @param {AppConfig} config
     */
    constructor(router, logger, config) {
        this.#logger = logger;
        this.#config = config;
        this.#instance = this.#init(router);
    }

    /**
     * Starts the Server
     * @returns {Promise<void>}
     */
    async start() {
        return new Promise((resolve) => {
            this.http = this.#instance.listen(this.#config.port, () => {
                const { port } = this.http.address();
                this.#logger.info({ port }, 'Gateway started');
                resolve();
            });
        });
    }

    /**
     * Gracefully stops the server
     * @param {number | undefined} status
     */
    async stop(status = 0) {
        const http = this.#http;
        if (!http) {
            throw new Error('Server is not running');
        }

        return new Promise((resolve, reject) => {
            this.#logger.info({ status }, 'stopping');
            http.close((err) => {
                if (err) {
                    reject(err);
                }
                resolve(status);
            });
        });
    }

    /**
     * Returns the express instance
     * @returns {express.Express}
     */
    invoke() {
        return this.#instance;
    }

    /**
     * @param {express.Router} router
     * @returns {express.Express}
     */
    #init(router) {
        const app = express();
        app.set('view engine', 'ejs');
        app.engine('ejs', ejsView);
        app.set('views', this.#config.viewsDir);
        app.use(express.static(this.#config.staticDir));
        app.disable('x-powered-by');
        app.use(router);
        return app;
    }
}
