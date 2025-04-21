export function WithPlaceholder(blot) {
    return class PlaceholderHelper extends blot {
        static withPlaceholder = true;
        static defaultPlaceholder = 'Enter text here';

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

            return node;
        }

        constructor(...args) {
            super(...args);

            // TEMP: workaround for placeholder visibility
            setTimeout(() => {
                this.handlePlaceholder();
            }, 0);
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
