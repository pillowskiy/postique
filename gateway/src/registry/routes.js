/* eslint-disable prettier/prettier */
import * as routes from '#app/routes/index.js';

import * as awilix from 'awilix';

const routeRegistries = /** @type {const} */ {
    appRouter: awilix.asFunction(routes.AppRoutes).singleton(),
    authRouter: awilix.asFunction(routes.AuthRoutes).singleton(),
};

export default routeRegistries;
