import * as routes from '#app/delivery/routes/index.js';

import * as awilix from 'awilix';

const routeRegistries = /** @type {const} */ {
    appRouter: awilix.asFunction(routes.AppRoutes).singleton(),
    authRouter: awilix.asFunction(routes.AuthRoutes).singleton(),
    postRouter: awilix.asFunction(routes.PostRoutes).singleton(),
};

export default routeRegistries;
