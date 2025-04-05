export const placeholderEvent = {
    name: 'text-change',
    handler: function (quill) {
        let index = quill.getSelection()?.index;
        if (typeof index !== 'number') {
            return;
        }

        const [line] = quill.getLine(index);
        if ('handlePlaceholder' in line) {
            line.handlePlaceholder();
        }
    },
};
