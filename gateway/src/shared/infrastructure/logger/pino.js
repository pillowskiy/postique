import pino from 'pino';

export class PinoLogger {
    /** @type {import('pino').Logger} */
    #logger;

    constructor() {
        this.#logger = pino({
            level: 'debug',
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                },
            },
        });
    }

    /**
     * @param {Object} struct
     * @param {string} message
     * @param {any[]} args
     * @returns {void}
     */
    debug(struct, message, ...args) {
        this.#logger.debug(struct, message, ...args);
    }

    /**
     * @param {Object} struct
     * @param {string} message
     * @param {any[]} args
     * @returns {void}
     */
    info(struct, message, ...args) {
        this.#logger.info(struct, message, ...args);
    }

    /**
     * @param {Object} struct
     * @param {string} message
     * @param {any[]} args
     * @returns {void}
     */
    error(struct, message, ...args) {
        this.#logger.error(struct, message, ...args);
    }

    /**
     * @param {Object} struct
     * @param {string} message
     * @param {any[]} args
     * @returns {void}
     */
    warning(struct, message, ...args) {
        this.#logger.warning(struct, message, ...args);
    }

    /**
     * @param {Object} struct
     * @param {string} message
     * @param {any[]} args
     * @returns {void}
     */
    critical(struct, message, ...args) {
        this.#logger.critical(struct, message, ...args);
    }
}
