export class Post {
    /**
     * @param {string} id
     * @param {string} title
     * @param {string} description
     * @param {string} visibility
     * @param {string} owner
     * @param {Array<string>} authors
     * @param {string} slug
     * @param {string} status
     * @param {Date|null} publishedAt
     * @param {Date} createdAt
     * @param {Date} updatedAt
     * @param {Array<PostParagraph>} paragraphs
     */
    constructor(
        id,
        title,
        description,
        visibility,
        owner,
        authors,
        slug,
        status,
        publishedAt,
        createdAt,
        updatedAt,
        paragraphs = [],
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.visibility = visibility;
        this.owner = owner;
        this.authors = authors;
        this.slug = slug;
        this.status = status;
        this.publishedAt = publishedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.paragraphs = paragraphs;
    }
}

export class PostParagraph {
    /**
     * @param {string} name
     * @param {number} type
     * @param {string} text
     * @param {Array<PostMarkup>} markups
     * @param {ImageMetadata|undefined} metadata
     * @param {CodeMetadata|undefined} codeMetadata
     */
    constructor(name, type, text, markups, metadata, codeMetadata) {
        this.name = name;
        this.type = type;
        this.text = text;
        this.markups = markups;
        this.metadata = metadata;
        this.codeMetadata = codeMetadata;
    }
}

export class PostMarkup {
    /**
     * @param {number} type
     * @param {number} start
     * @param {number} end
     * @param {string|undefined} href
     */
    constructor(type, start, end, href) {
        this.type = type;
        this.start = start;
        this.end = end;
        this.href = href;
    }
}

export class ImageMetadata {
    /**
     * @param {string} src
     * @param {number} originalWidth
     * @param {number} originalHeight
     */
    constructor(src, originalWidth, originalHeight) {
        this.src = src;
        this.originalWidth = originalWidth;
        this.originalHeight = originalHeight;
    }
}

export class CodeMetadata {
    /**
     * @param {string} language
     * @param {boolean} spellcheck
     */
    constructor(language, spellcheck) {
        this.language = language;
        this.spellcheck = spellcheck;
    }
}

export class PostIdentifier {
    /**
     * @param {string} postId
     */
    constructor(postId) {
        this.postId = postId;
    }
}

export class PostCursor {
    /**
     * @param {Array<Post>} items
     * @param {string|Date|null} cursorField
     * @param {number} size
     */
    constructor(items, cursorField, size) {
        this.items = items;
        this.cursorField = cursorField;
        this.size = size;
    }
}
