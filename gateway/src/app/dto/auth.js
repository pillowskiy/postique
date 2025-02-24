/* eslint-disable max-classes-per-file */

export class RegisterDTO {
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
