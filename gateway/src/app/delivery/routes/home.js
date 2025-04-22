import express from 'express';

import handler from '../common/handler.js';

/**
 * @param {import("#app/delivery/controllers").HomeController} homeController
 */
export function HomeRoutes(homeController) {
    const homeRouter = express.Router();

    homeRouter.get('/', handler(homeController, 'getHomeView'));

    return homeRouter;
}
