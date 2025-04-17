export function createSignal(initialValue) {
    let value = initialValue;
    const subscribers = new Set();

    return {
        get() {
            return JSON.parse(JSON.stringify(value));
        },
        set(newValue) {
            if (newValue !== value) {
                value = newValue;
                subscribers.forEach((fn) => fn(value));
            }
        },
        subscribe(fn) {
            subscribers.add(fn);
            fn(value);
            return () => subscribers.delete(fn);
        },
    };
}
