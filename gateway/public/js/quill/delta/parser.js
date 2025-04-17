import { MarkupType, ParagraphType } from './models.js';

export function deltaToQuillContents(paragraphs) {
    const quillContents = [];

    if (!paragraphs || !Array.isArray(paragraphs)) {
        return quillContents;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const paragraph of paragraphs) {
        const quillParagraph = paragraphToQuillFormat(paragraph);
        quillContents.push(...quillParagraph);
    }

    return quillContents;
}

function paragraphToQuillFormat(paragraph) {
    const quillOps = [];
    const { type, text, markups = [] } = paragraph;

    const sortedMarkups = [...markups].sort((a, b) => a.start - b.start);

    if (text && text.length > 0) {
        let lastIndex = 0;

        // eslint-disable-next-line no-restricted-syntax
        for (const markup of sortedMarkups) {
            if (markup.start > lastIndex) {
                quillOps.push({
                    insert: text.substring(lastIndex, markup.start),
                });
            }

            const markedText = text.substring(markup.start, markup.end);
            const attributes = markupToQuillAttributes(markup);

            quillOps.push({
                insert: markedText,
                attributes,
            });

            lastIndex = markup.end;
        }

        if (lastIndex < text.length) {
            quillOps.push({
                insert: text.substring(lastIndex),
            });
        }
    }

    quillOps.push({
        insert: '\n',
        attributes: paragraphTypeToQuillAttributes(paragraph),
    });

    return quillOps;
}

function markupToQuillAttributes(markup) {
    const attributes = {};
    const { type } = markup;

    switch (type) {
        case MarkupType.Bold:
            attributes.bold = true;
            break;
        case MarkupType.Italic:
            attributes.italic = true;
            break;
        case MarkupType.Underline:
            attributes.underline = true;
            break;
        case MarkupType.Strike:
            attributes.strike = true;
            break;
        case MarkupType.Code:
            attributes.code = true;
            break;
        case MarkupType.Link:
            attributes.link = markup.href || true;
            break;
        case MarkupType.Anchor:
            attributes.anchor = markup.id || true;
            break;
        case MarkupType.Image:
            break;
        case MarkupType.Video:
            break;
        case MarkupType.Quote:
            attributes.blockquote = true;
            break;
    }

    return attributes;
}

function paragraphTypeToQuillAttributes(paragraph) {
    const attributes = {};
    const { type, metadata, codeMetadata } = paragraph;

    // eslint-disable-next-line default-case
    switch (type) {
        case ParagraphType.Text:
            break;
        case ParagraphType.Code:
            attributes.code = true;
            if (codeMetadata && codeMetadata.lang) {
                attributes['code-language'] = codeMetadata.lang;
            }
            break;
        case ParagraphType.Figure:
            attributes.figure = true;
            break;
        case ParagraphType.Quote:
            attributes.blockquote = true;
            break;
        case ParagraphType.UnorderedList:
            attributes.list = 'bullet';
            break;
        case ParagraphType.OrderedList:
            attributes.list = 'ordered';
            break;
        case ParagraphType.Heading:
            attributes.header = metadata?.level || 1;
            break;
        case ParagraphType.Title:
            attributes.postTitle = { placeholder: 'Tell your story' };
            break;
    }

    return attributes;
}
