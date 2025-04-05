export function WithPlaceholder(blot) {
    return class PlaceholderHelper extends blot {
        static withPlaceholder = true;
        static defaultPlaceholder = 'Enter text here';

        constructor(...args) {
            super(...args);
        }

        static create(input) {
            const isValueHolder = input instanceof Object && 'value' in input;
            const value = isValueHolder ? input.value : input;

            const withPlaceholder =
                input instanceof Object && 'placeholder' in input;
            const placeholder = withPlaceholder
                ? input.placeholder
                : this.defaultPlaceholder;

            const node = super.create(value);
            node.setAttribute('ql-v-text', placeholder);
            node.setAttribute('ql-v-visible', !node.textContent.length);
            return node;
        }

        handlePlaceholder() {
            const isVirtualVisible = this.domNode.getAttribute('ql-v-visible');
            const isCurrentEmpty = this.domNode.textContent.length === 0;
            if (isVirtualVisible === isCurrentEmpty) {
                return;
            }

            if (isCurrentEmpty) {
                this.domNode.setAttribute('ql-v-visible', true);
            } else {
                this.domNode.removeAttribute('ql-v-visible');
            }
        }
    };
}
