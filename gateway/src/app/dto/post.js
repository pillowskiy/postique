export class CreatePostDTO {
    /**
     * @param {string} title
     * @param {string} description
     * @param {string} coverImage
     * @param {string} visibility
     */
    constructor(title, description, coverImage, visibility) {
        this.title = title;
        this.description = description;
        this.coverImage = coverImage;
        this.visibility = visibility;
    }
}

export class UpdatePostMetadataDTO {
    /**
     * @param {Object} data
     * @param {string} [data.title]
     * @param {string} [data.description]
     * @param {string} [data.coverImage]
     */
    constructor(data) {
        this.title = data.title;
        this.description = data.description;
        this.coverImage = data.coverImage;
    }
}

export class DeltaDTO {
    /**
     * @param {string} type
     * @param {Object} payload
     */
    constructor(type, payload) {
        this.type = type;
        this.payload = payload;
    }
}
