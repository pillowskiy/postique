import * as services from '#app/services/index.js';

import { asClass } from 'awilix';

/** @type {ReturnType<typeof asClass<services.AuthService>>} */
const authService = asClass(services.grpc.AuthService).singleton();

/** @type {ReturnType<typeof asClass<services.UserService>>} */
const userService = asClass(services.grpc.UserService).singleton();

/** @type {ReturnType<typeof asClass<services.FileService>>} */
const fileService = asClass(services.grpc.FileService).singleton();

/** @type {ReturnType<typeof asClass<services.PostService>>} */
const postService = asClass(services.rest.PostService).singleton();

/** @type {ReturnType<typeof asClass<services.InteractionService>>} */
const interactionService = asClass(
    services.rest.InteractionService,
).singleton();

/** @type {ReturnType<typeof asClass<services.BookmarkService>>} */
const bookmarkService = asClass(services.rest.BookmarkService).singleton();

/** @type {ReturnType<typeof asClass<services.CollectionService>>} */
const collectionService = asClass(services.rest.CollectionService).singleton();

/** @type {ReturnType<typeof asClass<services.CommentService>>} */
const commentService = asClass(services.rest.CommentService).singleton();

/** @type {ReturnType<typeof asClass<services.LikeService>>} */
const likeService = asClass(services.rest.LikeService).singleton();

/** @type {ReturnType<typeof asClass<services.ViewService>>} */
const viewService = asClass(services.rest.ViewService).singleton();

/** @type {ReturnType<typeof asClass<services.PreferenceService>>} */
const preferenceService = asClass(services.rest.PreferencesService).singleton();

const providerRegistries = /** @type {const} */ {
    authService,
    userService,
    fileService,
    postService,
    interactionService,
    commentService,
    bookmarkService,
    collectionService,
    likeService,
    viewService,
    preferenceService,
};

export default providerRegistries;
