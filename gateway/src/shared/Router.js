import compression from 'compression';
import express from 'express';

/**
 * @param {import('express').Router} apiRouter
 * @returns {import('express').Router}
 */
export default function Router(apiRouter) {
    const internalRouter = express.Router();

    internalRouter
        .use(compression())
        .use(express.json())
        .use(express.urlencoded({ extended: true }))
        .use(apiRouter);

    return internalRouter;
}
