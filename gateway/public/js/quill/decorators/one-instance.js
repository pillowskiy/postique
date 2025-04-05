export function OneInstance(blot, alternativeBlot) {
    return class OneInstanceHelper extends blot {
        static oneInstance = true;
        static instance = null;

        constructor(node, value) {
            super(node, value);

            if (!OneInstanceHelper.instance) {
                OneInstanceHelper.instance = node;
            }
        }

        static create(value) {
            if (OneInstanceHelper.instance) {
                return alternativeBlot.create(value);
            }

            return super.create(value);
        }

        static formats(domNode) {
            if (OneInstanceHelper.instance) {
                return alternativeBlot.formats(domNode);
            }
            return super.formats(domNode);
        }

        clone() {
            const blot = super.clone();
            if (OneInstanceHelper.instance) {
                blot.replaceWith(alternativeBlot.blotName);
            }
            return blot;
        }

        remove() {
            if (OneInstanceHelper.instance === this.domNode) {
                OneInstanceHelper.instance = null;
            }
            return super.remove();
        }
    };
}
