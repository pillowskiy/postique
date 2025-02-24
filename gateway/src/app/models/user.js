/* eslint-disable max-classes-per-file */

export class User {
    /**
     * @param {string} id
     * @param {string} username
     * @param {string} avatarUrl
     */
    constructor(id, username, avatarUrl) {
        /** @type {string} */
        this.id = id;
        /** @type {string} */
        this.username = username;
        /** @type {string} */
        this.avatarUrl = avatarUrl;
    }
}

export class Session {
    /**
     * @param {string} accessToken
     * @param {string} refreshToken
     * @param {string} tokenType
     * @param {number} expiresIn
     */
    constructor(accessToken, refreshToken, tokenType, expiresIn) {
        /** @type {string} */
        this.accessToken = accessToken;
        /** @type {string} */
        this.refreshToken = refreshToken;
        /** @type {string} */
        this.tokenType = tokenType;
        /** @type {number} */
        this.expiresIn = expiresIn;
    }
}
