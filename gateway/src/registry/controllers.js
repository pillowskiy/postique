import {
    AuthController,
    CommentController,
    HomeController,
    InteractionController,
    MeController,
    PostController,
} from '#app/delivery/controllers/index.js';

import { asClass } from 'awilix';

const controllerRegistries = /** @type {const} */ {
    authController: asClass(AuthController).singleton(),
    postController: asClass(PostController).singleton(),
    meController: asClass(MeController).singleton(),
    homeController: asClass(HomeController).singleton(),
    interactionController: asClass(InteractionController).singleton(),
    commentController: asClass(CommentController).singleton(),
};

export default controllerRegistries;
