import * as mw from '#app/middlewares/index.js';

import * as awilix from 'awilix';

const routeRegistries = /** @type {const} */ {
    authMiddlewares: awilix.asClass(mw.AuthMiddlewares).singleton(),
    middlewares: awilix.asClass(mw.GeneralMiddlewares).singleton(),
};

export default routeRegistries;
