import express from 'express';

/** @param {import("express").Router} fileRouter */
export function ApiRoutes(fileRouter) {
    const router = express.Router();

    router.use(fileRouter);

    return router;
}
