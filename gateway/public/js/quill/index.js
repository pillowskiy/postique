import Quill from 'quill';

import { listenEvents } from './events.js';
import { registerOverhead } from './overhead.js';
import './registry.js';
import * as state from './state.js';

function quill(id = '#editor') {
    const toolbarRoot = document.createElement('div');
    toolbarRoot.id = 'toolbar';
    toolbarRoot.className = 'ql-toolbar';
    toolbarRoot.innerHTML = `
    <span class="ql-formats">
        <button type="button" class="ql-bold"></button>
        <button type="button" class="ql-italic"></button>
        <button type="button" class="ql-link"></button>
    </span>
    <span class="ql-formats">
        <button type="button" class="ql-header" value="1"></button>
        <button type="button" class="ql-header" value="2"></button>
        <button type="button" class="ql-blockquote"></button>
    </span>
    `;

    const quill = new Quill(id, {
        theme: 'bubble',
        modules: {
            toolbar: true,
            imageTooltip: { toolbar: toolbarRoot },
            deltaApplier: true,
        },
    });
    quill.addContainer(document.querySelector('#sidebar-controls'));
    listenEvents(quill);
    registerOverhead(quill);
}

export default {
    state,
    quill,
};
