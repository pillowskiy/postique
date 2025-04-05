export const selectChangeEvent = {
    name: 'selection-change',
    handler: function (quill, range, oldRange, source) {
        if (source !== 'user') {
            return true;
        }

        const [line] = quill.getLine(range ? range.index : oldRange.index);
        if (line && line.constructor.blotName === 'image') {
            quill.theme.tooltip.hide();
        }

        if (oldRange) {
            const [oldSelectionLine] = quill.getLine(oldRange.index);
            toggleSelectionState(oldSelectionLine, 'select');
        }

        if (range) {
            const [newSelectionLine] = quill.getLine(range.index);
            toggleSelectionState(newSelectionLine, 'deselect');
        }
    },
};

function toggleSelectionState(line, action) {
    if (!line || !line.domNode) {
        return;
    }

    switch (action) {
        case 'select':
            line.domNode.setAttribute('data-selected', '');
            break;
        case 'deselect':
            line.domNode.removeAttribute('data-selected');
            break;
        default:
            break;
    }
}
