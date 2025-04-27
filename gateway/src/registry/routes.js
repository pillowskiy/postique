import * as routes from '#app/delivery/routes/index.js';

import * as awilix from 'awilix';

const routeRegistries = /** @type {const} */ {
    appRouter: awilix.asFunction(routes.AppRoutes).singleton(),
    authRouter: awilix.asFunction(routes.AuthRoutes).singleton(),
    postRouter: awilix.asFunction(routes.PostRoutes).singleton(),
    meRouter: awilix.asFunction(routes.MeRoutes).singleton(),
    homeRouter: awilix.asFunction(routes.HomeRoutes).singleton(),
    reactionRouter: awilix.asFunction(routes.ReactionRoutes).singleton(),
    interactionRouter: awilix.asFunction(routes.InteractionRoutes).singleton(),
    commentRouter: awilix.asFunction(routes.CommentRoutes).singleton(),
    bookmarkRouter: awilix.asFunction(routes.BookmarkRoutes).singleton(),
    collectionRouter: awilix.asFunction(routes.CollectionRoutes).singleton(),
};

export default routeRegistries;
