import * as services from '#app/services/index.js';

import { asClass } from 'awilix';

/** @type {ReturnType<typeof asClass<services.AuthService>>} */
const authService = asClass(services.grpc.AuthService).singleton();

/** @type {ReturnType<typeof asClass<services.FileService>>} */
const fileService = asClass(services.grpc.FileService).singleton();

/** @type {ReturnType<typeof asClass<services.PostService>>} */
const postService = asClass(services.rest.PostService).singleton();

/** @type {ReturnType<typeof asClass<services.InteractionService>>} */
const interactionService = asClass(
    services.rest.InteractionService,
).singleton();

const bookmarkService = asClass(services.rest.BookmarkService).singleton();
const collectionService = asClass(services.rest.CollectionService).singleton();

/** @type {ReturnType<typeof asClass<services.CommentService>>} */
const commentService = asClass(services.rest.CommentService).singleton();

const providerRegistries = /** @type {const} */ {
    authService,
    fileService,
    postService,
    interactionService,
    commentService,
    bookmarkService,
    collectionService,
};

export default providerRegistries;
