import * as models from '#app/models/index.js';

import { ChannelCredentials, Metadata } from '@postique/pb/grpc';
import * as auth from '@postique/pb/v1/sso/auth.pb';

import GRPCHandler from './common/handler.js';

/** @typedef {import('#shared/config').AuthServiceConfig} AuthServiceConfig */

/**
 * @extends {GRPCHandler<auth.AuthClient>}
 */
export class AuthService extends GRPCHandler {
    /** @type {AuthServiceConfig} */
    #config;

    /**
     * @param {AuthServiceConfig} config
     */
    constructor(config) {
        super(
            new auth.AuthClient(
                config.authService.address,
                ChannelCredentials.createInsecure(),
            ),
        );
        this.#config = config;
    }

    /**
     * @param {import("#app/dto").RegisterDTO} input
     * @returns {Promise<void>}
     */
    async register(input) {
        await this.call('register', input);
    }

    /**
     * @param {import("#app/dto").LoginDTO} input
     * @returns {Promise<models.Session>}
     */
    async login(input) {
        const { session } = await this.call('login', {
            appName: this.#config.authService.appName,
            ...input,
        });

        return this.#sessionToModel(session);
    }

    /**
     * @param {string} token
     * @returns {Promise<models.User>}
     */
    async verify(token) {
        const metadata = new Metadata();
        metadata.add('authorization', `Bearer ${token}`);
        const user = await this.call('verify', {}, metadata);

        return {
            id: user.userId,
            username: user.username,
            avatarUrl: user.avatarPath,
        };
    }

    /**
     * @param {string} token
     * @returns {Promise<models.Session>}
     */
    async refresh(token) {
        const { session } = await this.call('refresh', {
            appName: this.#config.authService.appName,
            token,
        });

        return this.#sessionToModel(session);
    }

    /**
     * @param {auth.Session | undefined} session
     * @returns {models.Session}
     */
    #sessionToModel(session) {
        if (!session) {
            throw new Error('Invalid session');
        }

        return {
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
            tokenType: session.tokenType,
            expiresIn: session.expiresIn,
        };
    }
}
