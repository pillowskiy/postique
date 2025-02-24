import { AuthController } from '#app/controllers/auth.js';

import { asClass } from 'awilix';

const controllerRegistries = /** @type {const} */ {
    authController: asClass(AuthController).singleton(),
};

export default controllerRegistries;
