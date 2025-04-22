import Quill from 'quill';

const Block = Quill.import('blots/block');

function memoTooltip() {
    let tooltip = null;

    return () => {
        if (!tooltip) {
            tooltip = document.querySelector('#sidebar-controls');
        }
        return tooltip;
    };
}

const tooltip = memoTooltip();

setTimeout(() => {
    const trigger = document.querySelector('#show-controls');
    trigger.addEventListener('click', () => {
        tooltip().classList.toggle('active');
    });
});

export const tooltipEvent = {
    name: 'editor-change',
    handler: (quill, eventType, range) => {
        if (range === null || eventType !== 'selection-change') return;

        const tl = tooltip();
        if (range.length === 0) {
            tl.style.display = 'none';

            const [block] = quill.scroll.descendant(Block, range.index);
            if (
                block !== null &&
                block.domNode.firstChild instanceof HTMLBRElement &&
                block.constructor.blotName !== 'postTitle'
            ) {
                const lineBounds = quill.getBounds(range);
                const translate = (lineBounds.height - 34) / 2;
                tl.classList.remove('active');
                tl.style.display = 'block';
                tl.style.transform = `translateY(${translate}px)`;
                tl.style.position = 'absolute';
                tl.style.left = `${lineBounds.left - 60}px`;
                tl.style.top = `${lineBounds.top}px`;
            } else {
                tl.style.display = 'none';
                tl.classList.remove('active');
            }
        } else {
            tl.style.display = 'none';
            tl.classList.remove('active');
        }
    },
};
