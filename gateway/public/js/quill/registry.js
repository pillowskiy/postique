import Quill from 'quill';

import * as blots from './blots/index.js';
import * as formats from './formats/index.js';
import * as modules from './modules/index.js';

const propertiesByPrefix = {
    formats: 'blotName',
    blots: 'blotName',
    modules: 'moduleName',
};

function registerImports(prefix, registry) {
    Object.entries(registry).forEach(([path, obj]) => {
        const prop = propertiesByPrefix[prefix];
        const name = obj.hasOwnProperty(prop)
            ? obj[prop]
            : obj.name.toLowerCase();

        if (!obj.hasOwnProperty(prop)) {
            console.warn(
                `Registry object ${obj.name || path || obj.constructor.name} does not have a ${prop} property, registering as ${prefix}/${name}`,
            );
        }

        Quill.register(`${prefix}/${name}`, obj);
    });
}

registerImports('blots', blots);
registerImports('formats', formats);
registerImports('modules', modules);
