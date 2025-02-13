import { asFunction } from 'awilix';

import { ApiRouter } from '../../../api/delivery/rest/router/index.js';

export const deliveryRegistries = /** @type {const} */ {
    apiRouter: asFunction(ApiRouter).singleton(),
};
