/* eslint-disable max-classes-per-file */

export class RegisterDTO {
    /**
     * @param {string} username
     * @param {string} email
     * @param {string} password
     */
    constructor(username, email, password) {
        /** @type {string} */
        this.email = email;
        /** @type {string} */
        this.password = password;
        /** @type {string} */
        this.username = username;
    }
}

export class LoginDTO {
    /**
     * @param {string} email
     * @param {string} password
     */
    constructor(email, password) {
        /** @type {string} */
        this.email = email;
        /** @type {string} */
        this.password = password;
    }
}

export class RefreshDTO {
    /**
     * @param {string} token
     */
    constructor(token) {
        /** @type {string} */
        this.token = token;
    }
}
