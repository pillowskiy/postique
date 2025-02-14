import pino from 'pino';

export class PinoLogger {
    /** @type {import('pino').Logger} */
    #logger;

    /**
     * @param {import('#shared/config/index.js').LoggerConfig} config
     */
    constructor(config) {
        this.#logger = pino({
            level: config.logger.level,
            transport: this.#parseTransportTarget(config),
        });
    }

    /**
     * @param {import('#shared/config/index.js').LoggerConfig} config
     * @returns {import('pino').TransportSingleOptions}
     */
    #parseTransportTarget(config) {
        const { transport } = config.logger;
        switch (config.logger.transport) {
            case 'pretty':
                return {
                    target: 'pino-pretty',
                    options: {
                        colorize: true,
                    },
                };
            case 'json':
                return {
                    target: 'json',
                };
            default:
                throw new Error(`Unknown transport ${transport}`);
        }
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
    warn(struct, message, ...args) {
        this.#logger.warn(struct, message, ...args);
    }

    /**
     * @param {Object} struct
     * @param {string} message
     * @param {any[]} args
     * @returns {void}
     */
    critical(struct, message, ...args) {
        this.#logger.fatal(struct, message, ...args);
    }

    /**
     * @param {boolean} condition
     * @param {string} message
     * @param {any[]} args
     * @returns {void}
     */
    assert(condition, message, ...args) {
        if (!condition) {
            this.critical({}, message, ...args);
        }
    }
}
