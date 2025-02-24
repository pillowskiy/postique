import compression from 'compression';
import express from 'express';

/**
 * @param {import('express').Router} appRouter
 * @returns {import('express').Router}
 */
export default function Router(appRouter) {
    const internalRouter = express.Router();

    internalRouter
        .use(compression())
        .use(express.json())
        .use(express.urlencoded({ extended: true }))
        .use(appRouter);

    return internalRouter;
}
