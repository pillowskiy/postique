import {
    CodeMetadata,
    Delta,
    ImageMetadata,
    Markup,
    Paragraph,
} from './models.js';

export class DeltaApplier {
    static _formatNames = [
        'align',
        'indent',
        'direction',
        'list',
        'header',
        'postTitle',
        'code',
        'blockquote',
        'code-block',
    ];

    constructor(quill) {
        this.quill = quill;
        this.batchDeltas = [];
        this.timeoutId = null;

        this.previousParagraphs = this.getParagraphs();
        console.log('Initial paragraphs:', this.previousParagraphs);

        quill.on('text-change', (delta) => {
            clearTimeout(this.timeoutId);
            this.batchDeltas.push(delta);

            this.timeoutId = setTimeout(() => {
                const changes = this.processChanges();
                console.log('Paragraph changes:', changes);
            }, 3000);
        });
    }

    getParagraphs() {
        const paragraphs = [];
        const contents = this.quill.getContents();

        let currentParagraphText = '';
        let currentParagraphFormats = {};
        let currentMarkups = [];

        let currentPosition = 0;

        let paragraphIndex = 0;

        for (const op of contents.ops) {
            if (typeof op.insert === 'string') {
                const textParts = op.insert.split('\n');

                for (let i = 0; i < textParts.length; i++) {
                    const text = textParts[i];

                    currentParagraphText += text;

                    if (op.attributes) {
                        const inlineFormatKeys = Object.keys(
                            op.attributes,
                        ).filter((k) => !DeltaApplier._formatNames.includes(k));

                        if (text.length > 0 && inlineFormatKeys.length > 0) {
                            const startPos = currentPosition;
                            const endPos = startPos + text.length;

                            for (const formatKey of inlineFormatKeys) {
                                currentMarkups.push(
                                    new Markup(formatKey, startPos, endPos),
                                );
                            }
                        }
                    }

                    currentPosition += text.length;

                    if (i < textParts.length - 1) {
                        let paragraphType = 'paragraph';
                        let imageMetadata = undefined;
                        let codeMetadata = undefined;

                        if (op.attributes) {
                            for (const key of DeltaApplier._formatNames) {
                                if (op.attributes[key] !== undefined) {
                                    const value = op.attributes[key];
                                    const newKey = this.lineFormatMapper(
                                        key,
                                        value,
                                    );
                                    if (newKey) {
                                        currentParagraphFormats[newKey] = value;
                                    }
                                }
                            }

                            paragraphType = this.determineParagraphType(
                                currentParagraphFormats,
                            );

                            if (currentParagraphFormats.code) {
                                codeMetadata = new CodeMetadata(
                                    currentParagraphFormats.language || 'plain',
                                    true,
                                );
                            }
                        }

                        const id = this.generateId();

                        const paragraph = new Paragraph(
                            id,
                            paragraphType,
                            currentParagraphText,
                            currentMarkups,
                            imageMetadata,
                            codeMetadata,
                        );

                        paragraphs.push(paragraph);
                        paragraphIndex++;

                        currentParagraphText = '';
                        currentParagraphFormats = {};
                        currentMarkups = [];
                        currentPosition = 0;
                    }
                }
            } else if (op.insert && typeof op.insert === 'object') {
                const embedType = Object.keys(op.insert)[0];
                const embedValue = op.insert[embedType];

                if (embedType === 'image') {
                    const imageMetadata = new ImageMetadata(
                        embedValue,
                        op.attributes?.width || 0,
                        op.attributes?.height || 0,
                    );

                    const id = this.generateId();

                    const paragraph = new Paragraph(
                        id,
                        'image',
                        '',
                        [],
                        imageMetadata,
                        undefined,
                    );

                    paragraphs.push(paragraph);
                    paragraphIndex++;

                    currentParagraphText = '';
                    currentParagraphFormats = {};
                    currentMarkups = [];
                    currentPosition = 0;
                }
            }
        }

        if (currentParagraphText || currentMarkups.length > 0) {
            const id = this.generateId();

            const paragraphType = this.determineParagraphType(
                currentParagraphFormats,
            );
            let codeMetadata = undefined;

            if (currentParagraphFormats.code) {
                codeMetadata = new CodeMetadata(
                    currentParagraphFormats.language || 'plain',
                    false,
                );
            }

            const paragraph = new Paragraph(
                id,
                paragraphType,
                currentParagraphText,
                currentMarkups,
                undefined,
                codeMetadata,
            );

            paragraphs.push(paragraph);
        }

        return paragraphs;
    }

    lineFormatMapper(attr, value) {
        switch (attr) {
            case 'align':
            case 'indent':
            case 'direction':
            case 'list':
            case 'header':
            case 'code':
            case 'blockquote':
                return attr;
            case 'postTitle':
                if (value === 1) {
                    return 'title';
                }
                return 'header';
            case 'code-block':
                return 'code';
            default:
                return null;
        }
    }

    generateId() {
        return Math.random().toString(36).slice(2, 8);
    }

    determineParagraphType(formats) {
        if (formats.postTitle) return 'postTitle';
        if (formats.header) return `h${formats.header}`;
        if (formats.list === 'ordered') return 'orderedList';
        if (formats.list === 'bullet') return 'unorderedList';
        if (formats['code-block'] || formats.code) return 'code';
        if (formats.blockquote) return 'blockquote';

        return 'paragraph'; // default type
    }

    processChanges() {
        if (this.batchDeltas.length === 0) return [];

        const currentParagraphs = this.getParagraphs();

        const deltas = this.determineParagraphChanges(
            this.previousParagraphs,
            currentParagraphs,
        );

        this.previousParagraphs = currentParagraphs;
        this.batchDeltas = [];

        return deltas;
    }

    determineParagraphChanges(oldParagraphs, newParagraphs) {
        const deltas = [];

        const lcsMatrix = Array.from({ length: oldParagraphs.length + 1 }, () =>
            Array(newParagraphs.length + 1).fill(0),
        );

        for (let i = 1; i <= oldParagraphs.length; i++) {
            for (let j = 1; j <= newParagraphs.length; j++) {
                if (
                    this.areParagraphsEqual(
                        oldParagraphs[i - 1],
                        newParagraphs[j - 1],
                    )
                ) {
                    lcsMatrix[i][j] = lcsMatrix[i - 1][j - 1] + 1;
                } else {
                    lcsMatrix[i][j] = Math.max(
                        lcsMatrix[i - 1][j],
                        lcsMatrix[i][j - 1],
                    );
                }
            }
        }

        const changes = {
            added: [],
            deleted: [],
            modified: [],
        };

        let i = oldParagraphs.length;
        let j = newParagraphs.length;

        while (i > 0 || j > 0) {
            if (
                i > 0 &&
                j > 0 &&
                this.areParagraphsEqual(
                    oldParagraphs[i - 1],
                    newParagraphs[j - 1],
                )
            ) {
                i--;
                j--;
            } else if (
                j > 0 &&
                (i === 0 || lcsMatrix[i][j - 1] >= lcsMatrix[i - 1][j])
            ) {
                changes.added.push({
                    index: j - 1,
                    paragraph: newParagraphs[j - 1],
                });
                j--;
            } else if (
                i > 0 &&
                (j === 0 || lcsMatrix[i][j - 1] < lcsMatrix[i - 1][j])
            ) {
                changes.deleted.push({
                    index: i - 1,
                    paragraph: oldParagraphs[i - 1],
                });
                i--;
            }
        }

        const potentialModifications = [];

        for (const deleted of changes.deleted) {
            for (const added of changes.added) {
                if (
                    deleted.paragraph.id === added.paragraph.id ||
                    (Math.abs(deleted.index - added.index) <= 2 &&
                        this.getTextSimilarity(
                            deleted.paragraph.text,
                            added.paragraph.text,
                        ) > 0.5)
                ) {
                    potentialModifications.push({
                        oldIndex: deleted.index,
                        newIndex: added.index,
                        oldParagraph: deleted.paragraph,
                        newParagraph: added.paragraph,
                    });
                    break;
                }
            }
        }

        for (const mod of potentialModifications) {
            mod.newParagraph.id = mod.oldParagraph.id;
            deltas.push(new Delta(mod.newParagraph, mod.newIndex, 'update'));

            changes.added = changes.added.filter(
                (add) => add.index !== mod.newIndex,
            );
            changes.deleted = changes.deleted.filter(
                (del) => del.index !== mod.oldIndex,
            );
        }

        for (const added of changes.added) {
            deltas.push(new Delta(added.paragraph, added.index, 'create'));
        }

        for (const deleted of changes.deleted) {
            deltas.push(new Delta(deleted.paragraph, deleted.index, 'delete'));
        }

        return deltas.sort((a, b) => a.index - b.index);
    }

    areParagraphsEqual(p1, p2) {
        if (!p1 || !p2) return false;

        if (p1.text !== p2.text || p1.type !== p2.type) return false;

        if (p1.markups.length !== p2.markups.length) return false;

        const sortedMarkups1 = [...p1.markups].sort((a, b) => {
            if (a.start !== b.start) return a.start - b.start;
            if (a.end !== b.end) return a.end - b.end;
            return a.type.localeCompare(b.type);
        });

        const sortedMarkups2 = [...p2.markups].sort((a, b) => {
            if (a.start !== b.start) return a.start - b.start;
            if (a.end !== b.end) return a.end - b.end;
            return a.type.localeCompare(b.type);
        });

        for (let i = 0; i < sortedMarkups1.length; i++) {
            const m1 = sortedMarkups1[i];
            const m2 = sortedMarkups2[i];

            if (
                m1.type !== m2.type ||
                m1.start !== m2.start ||
                m1.end !== m2.end
            ) {
                return false;
            }
        }

        if ((p1.metadata && !p2.metadata) || (!p1.metadata && p2.metadata))
            return false;

        if (p1.metadata && p2.metadata) {
            if (
                p1.metadata.src !== p2.metadata.src ||
                p1.metadata.originalWidth !== p2.metadata.originalWidth ||
                p1.metadata.originalHeight !== p2.metadata.originalHeight
            ) {
                return false;
            }
        }

        if (
            (p1.codeMetadata && !p2.codeMetadata) ||
            (!p1.codeMetadata && p2.codeMetadata)
        )
            return false;

        if (p1.codeMetadata && p2.codeMetadata) {
            if (
                p1.codeMetadata.lang !== p2.codeMetadata.lang ||
                p1.codeMetadata.spellcheck !== p2.codeMetadata.spellcheck
            ) {
                return false;
            }
        }

        return true;
    }

    getTextSimilarity(str1, str2) {
        const maxLen = Math.max(str1.length, str2.length);
        if (maxLen === 0) return 1.0; // Both empty strings

        const distance = this.levenshteinDistance(str1, str2);
        return 1 - distance / maxLen;
    }

    levenshteinDistance(str1, str2) {
        const m = str1.length;
        const n = str2.length;

        const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1, // deletion
                    dp[i][j - 1] + 1, // insertion
                    dp[i - 1][j - 1] + cost, // substitution
                );
            }
        }

        return dp[m][n];
    }
}
