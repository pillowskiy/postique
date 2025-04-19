import {
    AuthController,
    MeController,
    PostController,
} from '#app/delivery/controllers/index.js';

import { asClass } from 'awilix';

const controllerRegistries = /** @type {const} */ {
    authController: asClass(AuthController).singleton(),
    postController: asClass(PostController).singleton(),
    meController: asClass(MeController).singleton(),
};

export default controllerRegistries;
