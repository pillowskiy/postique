import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';

/**
 * @param {import('express').Router} apiRouter
 * @returns {import('express').Router}
 */
export default function Router(apiRouter) {
    const internalRouter = express.Router();

    internalRouter
        .use(helmet())
        .use(bodyParser.json())
        .use(bodyParser.urlencoded({ extended: true }))
        .use(compression())
        .use(apiRouter);

    return internalRouter;
}
