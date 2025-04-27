import {
    AuthController,
    BookmarkController,
    CollectionController,
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
    bookmarkController: asClass(BookmarkController).singleton(),
    collectionController: asClass(CollectionController).singleton(),
};

export default controllerRegistries;
