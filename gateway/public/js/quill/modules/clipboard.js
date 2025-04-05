import Quill from 'quill';

const Clipboard = Quill.import('modules/clipboard');

const Delta = Quill.import('delta');

export class FixedClipboard extends Clipboard {
    static moduleName = 'clipboard';

    constructor(...args) {
        super(...args);
    }

    onPaste(range, { text, html }) {
        // Get the formatting of the line in the current position to apply it to the first pasted line
        const formats = range ? this.quill.getFormat(range.index) : null;

        // Remove the remaining content of the current line starting from the cursor position
        const [line] = this.quill.getLine(range.index);
        const delta = new Delta()
            .retain(range.index)
            .delete(line.length() - range.index);
        this.quill.updateContents(delta, Quill.sources.SILENT);

        // Perform the default paste behavior (inserts the clipboard contents)
        super.onPaste(range, { text, html });

        if (formats) {
            // Use a macrotask to ensure this runs after the default paste handling completes
            setTimeout(() => {
                // Reapply the original formats to the newly inserted first line
                // NOTE: This could potentially be optimized with a Delta, but works fine for now
                Object.entries(formats).forEach(([name, value]) => {
                    this.quill.formatLine(range.index, name, value);
                });
            }, 1);
        }
    }
}
