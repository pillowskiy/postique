import Quill from 'quill';

import { DeltaApplier } from './delta/index.js';
import { listenEvents } from './events.js';
import { ImageTooltip } from './image-tooltip.js';
import { registerOverhead } from './overhead.js';
import './registry.js';

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

const quill = new Quill('#editor', {
    theme: 'bubble',
    modules: { toolbar: true },
});
listenEvents(quill);
registerOverhead(quill);

const imageTooltip = new ImageTooltip({ container: toolbarRoot }, quill);

quill.setContents([
    {
        insert: '\n',
        attributes: {
            postTitle: { placeholder: 'Tell your story' },
        },
    },
    {
        insert: '\n',
        attributes: {},
    },
]);

new DeltaApplier(quill);
