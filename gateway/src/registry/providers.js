import * as services from '#app/services/index.js';

import { asClass } from 'awilix';

/** @type {ReturnType<typeof asClass<services.AuthService>>} */
const authService = asClass(services.grpc.AuthService).singleton();

const providerRegistries = /** @type {const} */ {
    authService,
};

export default providerRegistries;
