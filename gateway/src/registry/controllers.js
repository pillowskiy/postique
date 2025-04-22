import {
    AuthController,
    HomeController,
    MeController,
    PostController,
} from '#app/delivery/controllers/index.js';

import { asClass } from 'awilix';

const controllerRegistries = /** @type {const} */ {
    authController: asClass(AuthController).singleton(),
    postController: asClass(PostController).singleton(),
    meController: asClass(MeController).singleton(),
    homeController: asClass(HomeController).singleton(),
};

export default controllerRegistries;
