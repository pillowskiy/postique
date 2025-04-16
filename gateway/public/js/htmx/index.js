import htmx from 'htmx.org';

import * as __ from './ajax.js';

export default {
    ...htmx,
    values: (...args) => {
        console.log('htmx.values', args);
        return htmx.values(...args);
    },
    __,
};
