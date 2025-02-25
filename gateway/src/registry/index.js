import { InjectionMode, createContainer } from 'awilix';

import controllerRegistries from './controllers.js';
import coreRegistries from './core.js';
import middlewareRegistries from './middlewares.js';
import serviceRegistries from './providers.js';
import routeRegistries from './routes.js';

/** @typedef {typeof coreRegistries & typeof routeRegistries & typeof controllerRegistries & typeof serviceRegistries & typeof middlewareRegistries} Registries */

/**
 * @template T
 * @typedef {(ioc: Partial<Registries>) => any} InjectableCallback
 */

/**
 * @type {import('awilix').AwilixContainer<Registries>}
 */
const container = createContainer({
    injectionMode: InjectionMode.CLASSIC,
    strict: true,
})
    .register(controllerRegistries)
    .register(serviceRegistries)
    .register(coreRegistries)
    .register(middlewareRegistries)
    .register(routeRegistries);

/** @namespace registry */
export default Object.freeze({
    /**
     * @template {keyof Registries} T
     * @param {T} name
     * @returns {ReturnType<Registries[T]['resolve']>}
     */
    resolve(name) {
        // @ts-expect-error Here is type conflicts, container with CLASSIC mode returns the injected value, not resolver
        return container.resolve(name);
    },
});
