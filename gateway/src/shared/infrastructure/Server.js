import express from 'express';

/** @typedef {import('./logger/index.js').Logger} Logger */

export default class Server {
    /** @type {express.Express} */
    #instance;

    /** @type {import('http').Server | null} */
    #http = null;

    /** @type {Logger} */
    #logger;

    /**
     * @param {express.Router} router
     * @param {Logger} logger
     * @returns {Server}
     */
    constructor(router, logger) {
        this.#instance = express();
        this.#logger = logger;
        this.#instance.use(router);
    }

    /**
     * Starts the Server
     * @returns {Promise<void>}
     */
    async start() {
        return new Promise((resolve) => {
            this.http = this.#instance.listen(5001, () => {
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
        return new Promise((resolve, reject) => {
            this.#logger.info({ status }, 'stopping');
            this.#http.close((err) => {
                if (err) {
                    reject(err);
                }
                resolve();
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
}
