import ejs from 'ejs';
import path, { dirname, relative } from 'path';

/**
 * @param {string} path
 * @param {object} data
 * @param {(err: Error | null, html: string) => void} cb
 * @returns {Promise<void>}
 */
export async function ejsView(path, data, cb) {
    try {
        const html = await ejs.renderFile(path, data, {
            async: true,
            cache: true,
        });
        cb(null, html);
    } catch (e) {
        cb(e, '');
    }
}

/**
 * @param {import('express').Response} res
 * @param {string} path
 * @param {object} data
 * @returns {void}
 */
function renderResponse(res, path, data) {
    return res.render(path, data, (err, html) => {
        if (err) {
            throw err;
        }

        return res.send(html);
    });
}

/**
 * @param {import('express').Response} res
 */
export function render(res) {
    /**
     * @typedef {Object} RenderNode
     * @property {string | null} targetPath
     * @property {string | null} parent
     * @property {string} engine
     * @property {render.Templates[keyof render.Templates] & { title?: string }} options
     */

    /** @type {RenderNode} */
    const renderNode = {
        targetPath: null,
        parent: 'layout',
        engine: 'ejs',
        options: { title: 'Postique' },
    };

    const defaultOptions = {
        cache: true,
    };

    function renderCurrent() {
        if (!renderNode.targetPath) {
            return renderResponse(res, 'index', {});
        }

        const target = `${renderNode.targetPath}.${renderNode.engine}`;

        if (renderNode.parent) {
            return renderResponse(res, renderNode.parent, {
                __renderTarget: relative(dirname(renderNode.parent), target),
                ...renderNode.options,
                ...defaultOptions,
            });
        }

        return renderResponse(res, target, renderNode.options);
    }

    const exports = /** @type {const} */ {
        /**
         * @param {string} str
         * @returns {typeof exports}
         */
        layout(str) {
            renderNode.parent = str;
            return exports;
        },

        /**
         * @template {keyof render.Templates} T
         * @param {T} targetPath
         * @param {render.Templates[T] & { title?: string }} options
         * @returns {typeof exports}
         */
        template(targetPath, options) {
            if (targetPath.split('.').length > 1) {
                renderNode.parent = null;
            }

            renderNode.targetPath = targetPath;
            renderNode.options = Object.assign(renderNode.options, options);
            return exports;
        },

        /**
         * @param {(f: never, r: never) => never} _cb
         * @returns {Promise<void>}
         */
        // eslint-disable-next-line no-unused-vars
        then: async (_cb) => renderCurrent(),

        /**
         * Execure the render function
         * @returns {void}
         */
        exec: renderCurrent,
    };

    return exports;
}
