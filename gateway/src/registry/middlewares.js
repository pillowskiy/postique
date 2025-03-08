import * as mw from '#app/delivery/middlewares/index.js';

import * as awilix from 'awilix';

const routeRegistries = /** @type {const} */ {
    authMiddlewares: awilix.asClass(mw.AuthMiddlewares).singleton(),
    csrfMiddlewares: awilix.asClass(mw.CSRFMiddlewares).singleton(),
    middlewares: awilix.asClass(mw.GeneralMiddlewares).singleton(),
};

export default routeRegistries;
