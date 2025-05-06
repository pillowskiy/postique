import * as models from '#app/models/index.js';

import { ChannelCredentials } from '@postique/pb/grpc';
import * as user from '@postique/pb/v1/sso/profile.pb';

import GRPCHandler from './common/handler.js';

/** @typedef {import('#shared/config').AuthServiceConfig} UserServiceConfig */

/**
 * @extends {GRPCHandler<user.ProfileClient>}
 */
export class UserService extends GRPCHandler {
    /**
     * @param {UserServiceConfig} config
     */
    constructor(config) {
        super(
            new user.ProfileClient(
                config.authService.address,
                ChannelCredentials.createInsecure(),
            ),
        );
    }

    /**
     * @param {string} userId
     * @param {import("#app/dto").UpdateProfileDTO} input
     * @returns {Promise<void>}
     */
    async updateProfile(userId, input) {
        await this.call('updateProfile', {
            userId,
            username: input.username,
            bio: input.bio,
            avatarPath: input.avatarPath,
        });
    }

    /**
     * @param {string} username
     * @returns {Promise<models.DetailedUser>}
     */
    async getProfile(username) {
        const user = await this.call('getProfile', { username });
        return this.#detailedUserToModel(user);
    }

    /**
     * @param {user.GetProfileResponse} user
     * @returns {models.DetailedUser}
     */
    #detailedUserToModel(user) {
        return {
            id: user.userId,
            username: user.profile.username,
            avatarUrl: user.profile.avatarPath,
            bio: user.profile.bio,
            // TEMP: To be removed
            createdAt: new Date(),
        };
    }
}
