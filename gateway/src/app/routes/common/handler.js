/**
 * Wraps an Express handler to ensure proper error handling and avoid loss of object context.
 *
 * This function does not bind the handler to `obj`, ensuring that `this` is not modified.
 * Instead, it calls the handler with the original request parameters and catches any thrown errors.
 * @template {Record<string, any>} T
 * @param {T} obj
 * @param {Extract<keyof T, {[K in keyof T]: T[K] extends import('express').Handler ? K : never}[keyof T]>} name
 * @returns {import('express').Handler}
 */
export default function handler(obj, name) {
    return async (req, res, next) => {
        try {
            return await obj[name](req, res, next);
        } catch (err) {
            return void next(err);
        }
    };
}
