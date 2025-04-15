import path from 'path';

/**
 * @typedef {AppConfig & LoggerConfig & AuthServiceConfig & FileServiceConfig & PostServiceConfig} Config
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
 *
 * @typedef {Object} FileServiceConfig
 * @property {Object} fileService
 * @property {string} fileService.address
 * @property {string} fileService.token
 *
 * @typedef {Object} PostServiceConfig
 * @property {Object} postService
 * @property {string} postService.address
 * @property {number} postService.timeout
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
            address: 'localhost:4000',
        },
        fileService: {
            address: 'localhost:6000',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJidWNrZXQiOiJ1c2VycyIsImlhdCI6MTc0MDY3OTQyOCwibmFtZSI6InNzbyJ9.g-AqHn7jInVvBhaiBowk3axWylRyMbYr6cL9Jjcen7U',
        },
        postService: {
            address: 'http://localhost:7001/api/v1',
            timeout: 5000,
        },
    };
}
