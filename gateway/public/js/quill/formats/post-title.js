import Quill from 'quill';

import { Named, OneInstance, WithPlaceholder } from '../decorators/index.js';

const Header = Quill.import('formats/header');

export class PostTitle extends Named(
    OneInstance(WithPlaceholder(Header), Header),
) {
    static blotName = 'postTitle';

    static create(...args) {
        const node = super.create(...args);
        node.setAttribute('data-title', true);
        return node;
    }

    constructor(node, ...args) {
        super(node, ...args);
    }
}
