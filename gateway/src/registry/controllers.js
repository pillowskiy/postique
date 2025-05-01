import * as controllers from '#app/delivery/controllers/index.js';

import { asClass } from 'awilix';

const controllerRegistries = /** @type {const} */ {
    authController: asClass(controllers.AuthController).singleton(),
    postController: asClass(controllers.PostController).singleton(),
    meController: asClass(controllers.MeController).singleton(),
    homeController: asClass(controllers.HomeController).singleton(),
    interactionController: asClass(
        controllers.InteractionController,
    ).singleton(),
    commentController: asClass(controllers.CommentController).singleton(),
    bookmarkController: asClass(controllers.BookmarkController).singleton(),
    collectionController: asClass(controllers.CollectionController).singleton(),
    likeController: asClass(controllers.LikeController).singleton(),
    viewController: asClass(controllers.ViewController).singleton(),
};

export default controllerRegistries;
