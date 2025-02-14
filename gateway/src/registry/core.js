/* eslint-disable prettier/prettier */
import Router from '#shared/Router.js';
import Server from '#shared/Server.js';
import Config from '#shared/config/index.js';
import { PinoLogger } from '#shared/logger/index.js';

import { asClass, asFunction } from 'awilix';

export const coreRegistries = /** @type {const} */ {
    router: asFunction(Router).singleton(),
    server: asClass(Server).singleton(),
    logger: asClass(PinoLogger).singleton(),
    config: asFunction(Config).singleton(),
};
