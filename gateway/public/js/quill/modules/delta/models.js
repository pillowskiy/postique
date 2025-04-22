export const DeltaType = /** @type {const} */ {
    Create: 0,
    Delete: 1,
    Update: 2,
};

export const ParagraphType = /** @type {const} */ {
    Text: 0,
    Code: 1,
    Figure: 2,
    Quote: 3,
    UnorderedList: 4,
    OrderedList: 5,
    Heading: 6,
    Title: 7,
};

export const MarkupType = /** @type {const} */ {
    Bold: 0,
    Italic: 1,
    Underline: 2,
    Strike: 3,
    Code: 4,
    Link: 5,
    Anchor: 6,
    Image: 7,
    Video: 8,
    Quote: 9,
    NewLine: 10,
};

export class Delta {
    constructor(paragraph, index, type) {
        this.paragraph = paragraph;
        this.index = index;
        this.type = type;
    }
}

export class Paragraph {
    constructor(type, text, markups, metadata, codeMetadata) {
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
