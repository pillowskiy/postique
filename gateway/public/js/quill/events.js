import * as events from './events/index.js';

export function listenEvents(quill) {
    const eventsSet = {};
    Object.values(events).forEach((event) => {
        const handlers = eventsSet[event.name];
        if (!handlers) {
            eventsSet[event.name] = [event.handler];
            return;
        }
        handlers.push(event.handler);
    });

    Object.entries(eventsSet).forEach(([name, handlers]) => {
        quill.on(name, (...args) => {
            handlers.forEach((handler) => handler(quill, ...args));
        });
    });
}
