import Quill from 'quill';

const icons = Quill.import('ui/icons');

const isScrollable = (el) => {
    const { overflowY } = getComputedStyle(el, null);
    return overflowY !== 'visible' && overflowY !== 'clip';
};

export class ImageTooltip {
    static TEMPLATE = [
        '<span class="ql-tooltip-arrow"></span>',
        '<div class="ql-tooltip-editor">',
        '<div>Hello world</div>',
        '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">',
        '<a class="ql-close"></a>',
        '</div>',
    ].join('');

    constructor(toolbar, quill) {
        this.root = quill.addContainer('ql-tooltip');
        this.root.innerHTML = this.constructor.TEMPLATE;
        this.root.classList.add('ql-flip');
        this.hide();
        this.boundsContainer = document.body;
        this.quill = quill;

        if (toolbar.container != null) {
            this.root.appendChild(toolbar.container);
            quill.theme.buildButtons(
                toolbar.container.querySelectorAll('button'),
                icons,
            );
            quill.theme.buildPickers(
                toolbar.container.querySelectorAll('select'),
                icons,
            );
        }

        if (isScrollable(this.quill.root)) {
            this.quill.root.addEventListener('scroll', () => {
                this.root.style.marginTop = `${-1 * this.quill.root.scrollTop}px`;
            });
        }

        this.quill.on('selection-change', () => {
            this.hide();
        });

        this.quill.root.addEventListener('click', (e) => {
            const target = e.target ?? e.srcElement;
            if (target instanceof HTMLImageElement) {
                e.preventDefault();
                this.show();
                this.root.style.left = '0px';
                this.root.style.width = `240px`;
                const bounds = target.getBoundingClientRect();
                if (bounds == null) {
                    return;
                }

                if (bounds != null) {
                    const { inView } = this.position(target);
                    if (!inView) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                            inline: 'nearest',
                        });
                    }
                    return;
                }
            } else if (!target.classList.contains('ql-hidden')) {
                this.hide();
            }
        });
    }

    listen() {
        this.root.querySelector('.ql-close').addEventListener('click', () => {
            this.root.classList.remove('ql-editing');
        });
        this.quill.on('scroll-optimize', () => {
            // Let selection be restored by toolbar handlers before repositioning
            setTimeout(() => {
                if (this.root.classList.contains('ql-hidden')) return;
                const range = this.quill.getSelection();
                if (range != null) {
                    const bounds = this.quill.getBounds(range);
                    if (bounds != null) {
                        this.position(bounds);
                    }
                }
            }, 1);
        });
    }

    cancel() {
        this.show();
    }

    hide() {
        this.root.classList.add('ql-hidden');
    }

    show() {
        this.root.classList.remove('ql-editing');
        this.root.classList.remove('ql-hidden');
    }

    position(node) {
        const scrollTop =
            this.boundsContainer.scrollTop ||
            window.pageYOffset ||
            document.documentElement.scrollTop;
        const reference = node.getBoundingClientRect();

        const left =
            reference.left + reference.width / 2 - this.root.offsetWidth / 2;
        const top = scrollTop + reference.top - this.root.offsetHeight * 3;

        const inView = top > scrollTop;
        const arrow = this.root.querySelector('.ql-tooltip-arrow');
        arrow.style.display = inView ? '' : 'none';
        this.root.style.top = `${inView ? top : top + node.offsetHeight}px`;

        this.root.style.left = `${left}px`;
        const containerBounds = this.boundsContainer.getBoundingClientRect();
        const rootBounds = this.root.getBoundingClientRect();
        let shift = 0;
        if (rootBounds.right > containerBounds.right) {
            shift = containerBounds.right - rootBounds.right;
            this.root.style.left = `${left + shift}px`;
        }
        if (rootBounds.left < containerBounds.left) {
            shift = containerBounds.left - rootBounds.left;
            this.root.style.left = `${left + shift}px`;
        }

        arrow.style.marginLeft = '';
        if (shift !== 0) {
            arrow.style.marginLeft = `${-1 * shift - arrow.offsetWidth / 2}px`;
        }
        return { shift, inView };
    }
}
