export class CreatePostDTO {
    /**
     * @param {string} title
     * @param {string} description
     * @param {string} content
     * @param {string} visibility
     */
    constructor(title, description, content, visibility) {
        this.title = title;
        this.description = description;
        this.content = content;
        this.visibility = visibility;
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
