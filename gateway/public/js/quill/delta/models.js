export class Delta {
    constructor(paragraph, index, type) {
        this.paragraph = paragraph;
        this.index = index;
        this.type = type;
    }
}

export class Paragraph {
    constructor(id, type, text, markups, metadata, codeMetadata) {
        this.id = id;
        this.type = type;
        this.text = text;
        this.markups = markups || [];
        this.metadata = metadata;
        this.codeMetadata = codeMetadata;
    }
}

export class Markup {
    constructor(type, start, end) {
        this.type = type;
        this.start = start;
        this.end = end;
    }
}

export class ImageMetadata {
    constructor(src, originalWidth, originalHeight) {
        this.src = src;
        this.originalWidth = originalWidth;
        this.originalHeight = originalHeight;
    }
}

export class CodeMetadata {
    constructor(lang, spellcheck) {
        this.lang = lang;
        this.spellcheck = spellcheck;
    }
}
