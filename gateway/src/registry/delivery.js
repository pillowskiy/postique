/* eslint-disable prettier/prettier */
import { ApiRouter } from '#api/delivery/rest/router/index.js';

import { asFunction } from 'awilix';

export const deliveryRegistries = /** @type {const} */ {
    apiRouter: asFunction(ApiRouter).singleton(),
};
