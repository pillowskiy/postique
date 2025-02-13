import { asClass, asFunction } from 'awilix';

import Router from '../Router.js';
import Server from '../Server.js';
import { PinoLogger } from '../logger/index.js';

export const coreRegistries = /** @type {const} */ {
    router: asFunction(Router).singleton(),
    server: asClass(Server).singleton(),
    logger: asClass(PinoLogger).singleton(),
};
