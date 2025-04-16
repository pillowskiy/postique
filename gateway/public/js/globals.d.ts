import htmx from 'htmx.org';

declare global {
    namespace globalThis {
        const htmx: typeof htmx;
    }
}
