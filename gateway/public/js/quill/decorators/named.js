export function Named(blot) {
    return class NamedBlot extends blot {
        constructor(...args) {
            super(...args);

            this.domNode.setAttribute('name', getRandomStr());
        }
    };
}

function getRandomStr() {
    return Math.random().toString(36).slice(2, 8);
}
