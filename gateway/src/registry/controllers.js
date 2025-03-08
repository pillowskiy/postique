import { AuthController } from '#app/delivery/controllers/index.js';

import { asClass } from 'awilix';

const controllerRegistries = /** @type {const} */ {
    authController: asClass(AuthController).singleton(),
};

export default controllerRegistries;
