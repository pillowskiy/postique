import * as overhead from './overhead/index.js';

export function registerOverhead(quill) {
    Object.values(overhead).forEach((overhead) => {
        overhead(quill);
    });
}
