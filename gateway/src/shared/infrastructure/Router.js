import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';

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
