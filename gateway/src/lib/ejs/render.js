/**
 * @template {keyof render.Templates} T
 * @param {T} targetPath
 * @param {render.Templates[T] & { title?: string }} options
 * @returns {[string,object]}
 */
export default function renderOpts(targetPath, options) {
    return [
        'layout',
        {
            __renderTarget: targetPath,
            title: options.title ?? 'Postique',
            ...options,
        },
    ];
}

/**
 * @param {import('express').Response} res
 */
export function render(res) {
    /**
     * @typedef {Object} RenderNode
     * @property {import('express').Response | null} res
     * @property {keyof render.Templates | null} targetPath
     * @property {string | null} parent
     * @property {string} engine
     * @property {render.Templates[keyof render.Templates] & { title?: string }} options
     */

    /** @type {RenderNode} */
    const renderNode = {
        res: null,
        targetPath: null,
        parent: 'layout',
        engine: 'ejs',
        options: { title: 'Postique' },
    };

    function renderCurrent() {
        if (!renderNode.targetPath) {
            return res.render('index', {});
        }

        const target = `${renderNode.targetPath}.${renderNode.engine}`;

        if (renderNode.parent) {
            return res.render(renderNode.parent, {
                __renderTarget: target,
                ...renderNode.options,
            });
        }

        return res.render(target, renderNode.options);
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
