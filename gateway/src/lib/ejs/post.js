// TEMP: Dedupe
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

/**
 * @typedef {import('#app/models/post').PostParagraph} Paragraph
 * @typedef {import('#app/models/post').PostMarkup} Markup
 * @typedef {import('#app/models/post').ImageMetadata} ImageMetadata
 * @typedef {import('#app/models/post').CodeMetadata} CodeMetadata
 */

/**
 * @typedef {Object} IToken
 * @property {number} position - The position in the text where token should be inserted
 * @property {string} tag - HTML tag name
 * @property {boolean} open - Whether this is an opening or closing tag
 * @property {string|undefined} attributes - HTML attributes as a string (for opening tags)
 */

/**
 * HTML renderer class for converting paragraphs to HTML
 */
export class PostContentRenderer {
    /**
     * Renders an array of paragraphs to HTML
     * @param {Paragraph[]} paragraphs - The paragraphs to render
     * @returns {string} The HTML representation
     */
    raw(paragraphs) {
        let html = '';

        for (let i = 0; i < paragraphs.length; ++i) {
            const paragraph = paragraphs[i];
            switch (paragraph.type) {
                case ParagraphType.Text:
                    html += this.renderText(paragraph);
                    break;
                case ParagraphType.Code:
                    html += this.renderCode(paragraph);
                    break;
                case ParagraphType.Figure:
                    html += this.renderFigure(paragraph);
                    break;
                case ParagraphType.Quote:
                    html += this.renderQuote(paragraph);
                    break;
                case ParagraphType.UnorderedList:
                case ParagraphType.OrderedList:
                    const listItems = [];
                    let j = i;
                    for (; j < paragraphs.length; ++j) {
                        const isListItem =
                            paragraphs[j].type ===
                                ParagraphType.UnorderedList ||
                            paragraphs[j].type === ParagraphType.OrderedList;
                        if (!isListItem) {
                            break;
                        }
                        listItems.push(this.renderListItem(paragraphs[j]));
                    }
                    i = j - 1; // Adjust index to continue after the list

                    const tag =
                        paragraph.type === ParagraphType.OrderedList
                            ? 'ol'
                            : 'ul';

                    html += `<${tag}>${listItems.join('')}</${tag}>`;
                    break;
                case ParagraphType.Heading:
                    html += this.renderHeading(paragraph);
                    break;
                case ParagraphType.Title:
                    html += this.renderTitle(paragraph);
                    break;
                default:
                    break;
            }
        }

        return html;
    }

    /**
     * Renders raw content without wrapping in paragraph tags
     * @param {Paragraph[]} paragraphs - The paragraphs to render
     * @returns {string} Raw HTML content
     */
    renderRaw(paragraphs) {
        let html = '';

        for (const paragraph of paragraphs) {
            const text = paragraph.text || '';
            const markups = paragraph.markups || [];
            html += this.applyMarkup(text, markups);
        }

        return html;
    }

    /**
     * Renders a text paragraph
     * @param {Paragraph} paragraph - The paragraph to render
     * @returns {string} HTML representation
     */
    renderText(paragraph) {
        const text = paragraph.text || '';
        const markups = paragraph.markups || [];
        const id = paragraph.id ? ` name="${paragraph.id}"` : '';

        return `<p${id}>${this.applyMarkup(text, markups)}</p>`;
    }

    /**
     * Renders a code paragraph
     * @param {Paragraph} paragraph - The paragraph to render
     * @returns {string} HTML representation
     */
    renderCode(paragraph) {
        const codeMetadata = paragraph.codeMetadata || {};
        const lang = codeMetadata.lang
            ? ` class="language-${codeMetadata.lang}"`
            : '';
        const id = paragraph.id ? ` name="${paragraph.id}"` : '';

        return `<pre${id}${lang}><code>${this.escapeHtml(paragraph.text || '')}</code></pre>`;
    }

    /**
     * Renders a figure paragraph
     * @param {Paragraph} paragraph - The paragraph to render
     * @returns {string} HTML representation
     */
    renderFigure(paragraph) {
        if (paragraph.type !== ParagraphType.Figure || !paragraph.metadata) {
            return '';
        }

        const imgMetadata = paragraph.metadata || {};
        const width = imgMetadata.originalWidth
            ? ` width="${imgMetadata.originalWidth}"`
            : '';
        const height = imgMetadata.originalHeight
            ? ` height="${imgMetadata.originalHeight}"`
            : '';
        const id = paragraph.id ? ` name="${paragraph.id}"` : '';

        const imgTag = `<img src="${imgMetadata.src || ''}" alt="${imgMetadata.alt || 'Image'}"${width}${height} />`;
        const caption = paragraph.text
            ? `<figcaption>${this.escapeHtml(paragraph.text)}</figcaption>`
            : '';

        return `<figure${id}>${imgTag}${caption}</figure>`;
    }

    /**
     * Renders a quote paragraph
     * @param {Paragraph} paragraph - The paragraph to render
     * @returns {string} HTML representation
     */
    renderQuote(paragraph) {
        const text = paragraph.text || '';
        const markups = paragraph.markups || [];
        const id = paragraph.id ? ` name="${paragraph.id}"` : '';

        return `<blockquote${id}>${this.applyMarkup(text, markups)}</blockquote>`;
    }

    /**
     * Renders a list item
     * @param {Paragraph} paragraph - The paragraph to render
     * @returns {string} HTML representation
     */
    renderListItem(paragraph) {
        const text = paragraph.text || '';
        const markups = paragraph.markups || [];
        const id = paragraph.id ? ` name="${paragraph.id}"` : '';

        return `<li${id}>${this.applyMarkup(text, markups)}</li>`;
    }

    /**
     * Renders a heading paragraph
     * @param {Paragraph} paragraph - The paragraph to render
     * @returns {string} HTML representation
     */
    renderHeading(paragraph) {
        const level = this.getHeadingLevel(paragraph);
        const text = paragraph.text || '';
        const markups = paragraph.markups || [];
        const id = paragraph.id ? ` name="${paragraph.id}"` : '';

        return `<h${level}${id}>${this.applyMarkup(text, markups)}</h${level}>`;
    }

    /**
     * Renders a title paragraph
     * @param {Paragraph} paragraph - The paragraph to render
     * @returns {string} HTML representation
     */
    renderTitle(paragraph) {
        const text = paragraph.text || '';
        const markups = paragraph.markups || [];
        const id = paragraph.id ? ` name="${paragraph.id}"` : '';

        return `<h1 class="title"${id}>${this.applyMarkup(text, markups)}</h1>`;
    }

    /**
     * Determines the heading level based on paragraph metadata
     * @param {Paragraph} paragraph - The heading paragraph
     * @returns {number} Heading level (1-6)
     */
    getHeadingLevel(paragraph) {
        // Default to level 2 for regular headings
        return paragraph.type === ParagraphType.Title ? 1 : 2;
    }

    /**
     * Applies markup to text
     * @param {string} text - The text to apply markup to
     * @param {Markup[]} markups - The markups to apply
     * @returns {string} Text with HTML markup
     */
    applyMarkup(text, markups) {
        if (!markups || markups.length === 0) return this.escapeHtml(text);

        // First, escape the HTML in the text
        let escapedTextSec = this.escapeHtml(text);
        let escapedText = text;
        console.log(
            `Before escape: ${text.length}, after escape: ${escapedTextSec.length}`,
        );

        // Create an array of tokens with position information
        const tokens = [];

        for (const markup of markups) {
            const tagInfo = this.getMarkupTag(markup);
            const tag = tagInfo[0];
            const attributes = tagInfo[1] || {};

            // Convert attributes object to string
            const attributesStr = Object.entries(attributes)
                .map(([key, value]) => `${key}="${value}"`)
                .join(' ');

            // For markup that requires immediate rendering like line breaks
            if (markup.type === MarkupType.NewLine) {
                tokens.push({
                    position: markup.start,
                    html: '<br>',
                    length: 0,
                });
                continue;
            }

            // Add opening tag at start position
            tokens.push({
                position: markup.start,
                html: `<${tag}${attributesStr ? ` ${attributesStr}` : ''}>`,
                length: 0,
            });

            // Add closing tag at end position
            tokens.push({
                position: markup.end,
                html: `</${tag}>`,
                length: 0,
            });
        }

        // Sort tokens by position in descending order so we can insert tags
        // from end to beginning without affecting other positions
        tokens.sort((a, b) => b.position - a.position);

        // Apply tokens to the escaped text
        for (const token of tokens) {
            escapedText =
                escapedText.slice(0, token.position) +
                token.html +
                escapedText.slice(token.position);
        }

        return escapedText;
    }

    /**
     * Gets the HTML tag and attributes for a markup
     * @param {Markup} markup - The markup
     * @returns {[string, Object<string, string>?]} The tag name and attributes object
     */
    getMarkupTag(markup) {
        switch (markup.type) {
            case MarkupType.Bold:
                return ['strong'];
            case MarkupType.Italic:
                return ['em'];
            case MarkupType.Underline:
                return ['u'];
            case MarkupType.Strike:
                return ['s'];
            case MarkupType.Code:
                return ['code'];
            case MarkupType.NewLine:
                return ['br'];
            case MarkupType.Quote:
                return ['blockquote'];
            case MarkupType.Link:
            case MarkupType.Anchor:
                return ['a', { href: markup.href || '#' }];
            case MarkupType.Video:
                return [
                    'video',
                    {
                        src: markup.src || '',
                        controls: 'controls',
                    },
                ];
            default:
                return ['span'];
        }
    }

    /**
     * Escapes HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}
