import { InjectionMode, createContainer } from 'awilix';

import { coreRegistries } from './core.js';
import { deliveryRegistries } from './delivery.js';

/** @typedef {coreRegistries | deliveryRegistries} Registries */

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
     * @template {keyof Registries} T Keyof Registries
     * @param {T} name  Name of the registration
     * @returns {ReturnType<Registries[T]['resolve']>} Registration
     */
    resolve(name) {
        return container.resolve(name);
    },
});
