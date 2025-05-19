import Quill from 'quill';

import { listenEvents } from './events.js';
import { ImageUploader } from './image-uploader.js';
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
    `;

    const quill = new Quill(id, {
        theme: 'bubble',
        modules: {
            toolbar: ['image', 'bold', 'italic'],
            imageTooltip: { toolbar: toolbarRoot },
            deltaApplier: true,
            imageUploader: { upload: new ImageUploader().upload },
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
