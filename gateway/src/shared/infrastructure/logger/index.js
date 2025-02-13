/**
 * @typedef {(struct: Record<any, any>, message: string, ...args: any[])} LoggerMethodArgs
 */

/**
 * @typedef {Object} Logger
 * @property {LoggerMethodArgs} debug
 * @property {LoggerMethodArgs} info
 * @property {LoggerMethodArgs} error
 * @property {LoggerMethodArgs} warning
 * @property {LoggerMethodArgs} critical
 */
export const Logger = {};

export * from './pino.js';
