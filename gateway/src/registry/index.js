import { InjectionMode, createContainer } from 'awilix';

import { coreRegistries } from './core.js';
import { deliveryRegistries } from './delivery.js';

/** @typedef {typeof coreRegistries & typeof deliveryRegistries} Registries */

/**
 * @type {import('awilix').AwilixContainer<Registries>}
 */
const container = createContainer({
    injectionMode: InjectionMode.CLASSIC,
    strict: true,
})
    .register(coreRegistries)
    .register(deliveryRegistries);

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
