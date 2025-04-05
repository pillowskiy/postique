import Quill from 'quill';

const Delta = Quill.import('delta');

/** @param {Quill} quill */
export function Keyboard(quill) {
    /**
     * NOTE: We intentionally bypass some polymorphic behavior here,
     * as `addBinding` does not behave as expected in this specific context.
     * Directly modifying the binding list ensures consistent behavior.
     */
    quill.keyboard.bindings['Enter'].unshift({
        key: 'Enter',
        shiftKey: null,
        collapsed: true,
        format: ['postTitle', 'header', 'blockquote'],
        handler: function (range, context) {
            insertNewLineAndToggleFormats(quill, range, context.format, {
                postTitle: null,
                header: null,
                blockquote: null,
            });
        },
    });
}

function insertNewLineAndToggleFormats(quill, range, oldFormats, newFormats) {
    const [line, offset] = quill.getLine(range.index);
    const delta = new Delta()
        .retain(range.index)
        .insert('\n', oldFormats)
        .retain(line.length() - offset - 1)
        .retain(1, newFormats);
    quill.updateContents(delta, Quill.sources.USER);
    quill.setSelection(range.index + 1, Quill.sources.SILENT);
    quill.focus();
}
