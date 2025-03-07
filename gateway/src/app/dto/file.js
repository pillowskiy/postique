export class UploadFileDTO {
    /**
     * @param {string} filename
     * @param {Buffer} data
     * @param {string} contentType
     */
    constructor(filename, data, contentType) {
        /** @type {string} */
        this.filename = filename;
        /** @type {Buffer} */
        this.data = data;
        /** @type {string} */
        this.contentType = contentType;
    }
}

export class DeleteFileDTO {
    /**
     * @param {string} path
     */
    constructor(path) {
        /** @type {string} */
        this.path = path;
    }
}
