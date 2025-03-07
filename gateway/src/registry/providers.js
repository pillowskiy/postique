import * as services from '#app/services/index.js';

import { asClass } from 'awilix';

/** @type {ReturnType<typeof asClass<services.AuthService>>} */
const authService = asClass(services.grpc.AuthService).singleton();


/** @type {ReturnType<typeof asClass<services.FileService>>} */
const fileService = asClass(services.grpc.FileService).singleton();

const providerRegistries = /** @type {const} */ {
    authService, fileService,
};

export default providerRegistries;
