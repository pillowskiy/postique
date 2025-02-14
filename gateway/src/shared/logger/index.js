/**
 * @typedef {(struct: Record<any, any>, message: string, ...args: any[]) => void} LogFn
 */

/**
 * @typedef {Object} Logger
 * @property {LogFn} debug
 * @property {LogFn} info
 * @property {LogFn} error
 * @property {LogFn} warn
 * @property {LogFn} critical
 * @property {(condition: boolean, message: string, ...args: any[]) => void} assert
 */

export * from './pino.js';
