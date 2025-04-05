import Quill from 'quill';

const Link = Quill.import('formats/link');
const BlockEmbed = Quill.import('blots/block/embed');

export class Image extends BlockEmbed {
    static blotName = 'image';
    static tagName = 'FIGURE';
    static ATTRIBUTES = ['alt', 'height', 'width'];

    static create(value) {
        const node = super.create(value);
        const img = document.createElement('img');
        img.setAttribute('loading', 'lazy');

        if (typeof value === 'string') {
            img.setAttribute('src', this.sanitize(value));
        }

        node.appendChild(img);
        return node;
    }

    static formats(domNode) {
        const imgNode = domNode.querySelector('img');
        if (!imgNode) {
            return {};
        }

        return Image.ATTRIBUTES.reduce((formats, attribute) => {
            if (imgNode.hasAttribute(attribute)) {
                formats[attribute] = imgNode.getAttribute(attribute);
            }
            return formats;
        }, {});
    }

    static match(url) {
        return (
            /\.(jpe?g|gif|png|webp)$/.test(url) ||
            /^data:image\/.+;base64/.test(url)
        );
    }

    static sanitize(url) {
        return Link.sanitize(url, ['http', 'https', 'data']) ? url : '//:0';
    }

    static value(domNode) {
        return domNode.querySelector('img').getAttribute('src');
    }

    constructor(...args) {
        super(...args);
    }

    format(name, value) {
        if (Image.ATTRIBUTES.indexOf(name) > -1) {
            if (value) {
                this.domNode.setAttribute(name, value);
            } else {
                this.domNode.removeAttribute(name);
            }
        } else {
            super.format(name, value);
        }
    }
}
