/**
 * @typedef {AppConfig & LoggerConfig} Config
 *
 * @typedef {Object} AppConfig
 * @property {number} port
 * @property {string} host
 * @property {'development' | 'production'} env
 *
 * @typedef {Object} LoggerConfig
 * @property {Object} logger
 * @property {'debug' | 'info' | 'warn' | 'error' | 'fatal'} logger.level
 * @property {'pretty' | 'json'} logger.transport
 */

/** @returns {Config} */
export default function Config() {
    return {
        port: 5001,
        host: '0.0.0.0',
        env: 'development',
        logger: {
            level: 'debug',
            transport: 'pretty',
        },
    };
}
