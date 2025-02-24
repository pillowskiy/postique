import path from 'path';

/**
 * @typedef {AppConfig & LoggerConfig & AuthServiceConfig} Config
 *
 * @typedef {Object} AppConfig
 * @property {number} port
 * @property {string} host
 * @property {'development' | 'production'} env
 * @property {string} staticDir
 * @property {string} viewsDir
 *
 * @typedef {Object} LoggerConfig
 * @property {Object} logger
 * @property {'debug' | 'info' | 'warn' | 'error' | 'fatal'} logger.level
 * @property {'pretty' | 'json'} logger.transport
 *
 * @typedef {Object} AuthServiceConfig
 * @property {Object} authService
 * @property {string} authService.address
 * @property {string} authService.appName
 */

const dirname = new URL('.', import.meta.url).pathname;

/** @returns {Config} */
export default function Config() {
    return {
        port: 5001,
        staticDir: path.join(dirname, '../../../_static'),
        viewsDir: path.join(dirname, '../../../views'),
        host: '0.0.0.0',
        env: 'development',
        logger: {
            level: 'debug',
            transport: 'pretty',
        },
        authService: {
            appName: 'www',
            address: 'sso:4000',
        },
    };
}
