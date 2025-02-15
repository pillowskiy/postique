/**
 * @template {keyof ejsView.EjsContent} T
 * @param {T} targetPath
 * @param {ejsView.EjsContent[T] & { title?: string }} options
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
 * @template {keyof ejsView.EjsContent} T
 * @param {T} targetPath
 * @param {ejsView.EjsContent[T] & { title?: string }} options
 */
export function render(targetPath, options) {
    let parent = 'layout';
    let res = null;

    const exports = {
        /**
         * @param {string} str
         * @returns {typeof exports}
         */
        layout(str) {
            parent = str;
            return this;
        },

        target(target) {
            targetPath = target;
            return this;
        },

        /**
         * @param {import('express').Response} response
         * @returns {typeof exports}
         */
        with(response) {
            res = response;
            return this;
        },

        /**
         * Execute the render
         * @returns {void}
         */
        exec() {
            if (res) {
                return res.render(parent, {
                    __renderTarget: targetPath,
                    title: options.title ?? 'Postique',
                    ...options,
                });
            }
        },

        /**
         * @param {(f: any, r: any) => any} _
         * @returns {Promise<void>}
         */
        async then(_) {
            if (res) {
                return res.render(parent, {
                    __renderTarget: targetPath,
                    title: options.title ?? 'Postique',
                    ...options,
                });
            }
        },
    };

    return exports;
}
