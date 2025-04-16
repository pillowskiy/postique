import {
    CodeMetadata,
    Delta,
    DeltaType,
    ImageMetadata,
    Markup,
    MarkupType,
    Paragraph,
    ParagraphType,
} from './models.js';

export class DeltaApplier {
    constructor(quill) {
        this.quill = quill;
        this.batchDeltas = [];
        this.timeoutId = null;
        this.lineFormatKeysSet = new Set([
            'align',
            'indent',
            'direction',
            'list',
            'header',
            'postTitle',
            'title',
            'code',
            'blockquote',
            'code-block',
            'codeblock',
        ]);

        this.previousParagraphs = this.getParagraphs();
        console.log('Initial paragraphs:', this.previousParagraphs);

        quill.on('text-change', (delta) => {
            clearTimeout(this.timeoutId);
            this.batchDeltas.push(delta);

            this.timeoutId = setTimeout(() => {
                const changes = this.processChanges();
                console.log('Paragraph changes:', changes);
                quill.emitter.emit('debounce-change', changes);
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
                        ).filter((k) => !this.lineFormatKeysSet.has(k));

                        if (text.length > 0 && inlineFormatKeys.length > 0) {
                            const startPos = currentPosition;
                            const endPos = startPos + text.length;

                            for (const formatKey of inlineFormatKeys) {
                                const formatType =
                                    this.determineMarkupType(formatKey);
                                currentMarkups.push(
                                    new Markup(formatType, startPos, endPos),
                                );
                            }
                        }
                    }

                    currentPosition += text.length;

                    if (i < textParts.length - 1) {
                        let paragraphType = ParagraphType.Text;
                        let codeMetadata;

                        if (op.attributes) {
                            for (const [key, value] of Object.entries(
                                op.attributes,
                            )) {
                                if (this.lineFormatKeysSet.has(key)) {
                                    currentParagraphFormats[key] = value;
                                }
                            }

                            paragraphType = this.determineParagraphType(
                                currentParagraphFormats,
                            );

                            if (
                                currentParagraphFormats['code-block'] ||
                                currentParagraphFormats.code
                            ) {
                                codeMetadata = new CodeMetadata(
                                    currentParagraphFormats.language || 'plain',
                                    true,
                                );
                            }
                        }

                        paragraphs.push(
                            new Paragraph(
                                paragraphType,
                                currentParagraphText,
                                [...currentMarkups],
                                undefined,
                                codeMetadata,
                            ),
                        );

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

                    paragraphs.push(
                        new Paragraph(
                            ParagraphType.Figure,
                            '',
                            [],
                            imageMetadata,
                        ),
                    );

                    paragraphIndex++;
                    currentParagraphText = '';
                    currentParagraphFormats = {};
                    currentMarkups = [];
                    currentPosition = 0;
                }
            }
        }

        if (currentParagraphText || currentMarkups.length > 0) {
            const paragraphType = this.determineParagraphType(
                currentParagraphFormats,
            );
            let codeMetadata;

            if (
                currentParagraphFormats['code-block'] ||
                currentParagraphFormats.code
            ) {
                codeMetadata = new CodeMetadata(
                    currentParagraphFormats.language || 'plain',
                    true,
                );
            }

            paragraphs.push(
                new Paragraph(
                    paragraphType,
                    currentParagraphText,
                    currentMarkups,
                    undefined,
                    codeMetadata,
                ),
            );
        }

        return paragraphs;
    }

    determineMarkupType(format) {
        if (format.link) return MarkupType.Link;
        if (format.anchor) return MarkupType.Anchor;
        if (format.image) return MarkupType.Image;
        if (format.video) return MarkupType.Video;
        if (format.quote) return MarkupType.Quote;
        if (format.strike) return MarkupType.Strike;
        if (format.newLine) return MarkupType.NewLine;
        if (format.bold) return MarkupType.Bold;
        if (format.code) return MarkupType.Code;
        if (format.italic) return MarkupType.Italic;
        if (format.underline) return MarkupType.Underline;

        return MarkupType.Bold;
    }

    determineParagraphType(formats) {
        if (formats.postTitle) return ParagraphType.Title;
        if (formats.header) return ParagraphType.Heading;
        if (formats.list === 'ordered') return ParagraphType.OrderedList;
        if (formats.list === 'bullet') return ParagraphType.UnorderedList;
        if (formats['code-block'] || formats.code) return ParagraphType.Code;
        if (formats.blockquote) return ParagraphType.Quote;
        if (formats.figure || formats.image) return ParagraphType.Figure;
        return ParagraphType.Text;
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
        if (!oldParagraphs.length && !newParagraphs.length) return [];
        if (!oldParagraphs.length) {
            return newParagraphs.map(
                (p, i) => new Delta(p, i, DeltaType.Create),
            );
        }
        if (!newParagraphs.length) {
            return oldParagraphs.map(
                (p, i) => new Delta(p, i, DeltaType.Delete),
            );
        }

        const deltas = [];
        const oldSize = oldParagraphs.length;
        const newSize = newParagraphs.length;
        const maxSize = Math.max(oldSize, newSize);

        if (maxSize <= 10) {
            return this.simpleDiff(oldParagraphs, newParagraphs);
        }

        const lcsMatrix = new Array(oldSize + 1);
        for (let i = 0; i <= oldSize; i++) {
            lcsMatrix[i] = new Array(newSize + 1).fill(0);
        }

        for (let i = 1; i <= oldSize; i++) {
            for (let j = 1; j <= newSize; j++) {
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

        const added = [];
        const deleted = [];

        let i = oldSize;
        let j = newSize;

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
                added.push({ index: j - 1, paragraph: newParagraphs[j - 1] });
                j--;
            } else if (i > 0) {
                deleted.push({ index: i - 1, paragraph: oldParagraphs[i - 1] });
                i--;
            }
        }

        for (const del of deleted) {
            const similarAddIndex = added.findIndex(
                (add) =>
                    Math.abs(del.index - add.index) <= 2 &&
                    this.getTextSimilarity(
                        del.paragraph.text,
                        add.paragraph.text,
                    ) > 0.5,
            );

            if (similarAddIndex !== -1) {
                const add = added[similarAddIndex];
                add.paragraph.id = del.paragraph.id;

                deltas.push(
                    new Delta(add.paragraph, add.index, DeltaType.Update),
                );

                added.splice(similarAddIndex, 1);
                continue;
            }

            deltas.push(new Delta(del.paragraph, del.index, DeltaType.Delete));
        }

        for (const add of added) {
            deltas.push(new Delta(add.paragraph, add.index, DeltaType.Create));
        }

        return deltas.sort((a, b) => a.index - b.index);
    }

    simpleDiff(oldParagraphs, newParagraphs) {
        const deltas = [];
        const oldSize = oldParagraphs.length;
        const newSize = newParagraphs.length;
        const minSize = Math.min(oldSize, newSize);

        let startMatches = 0;
        while (
            startMatches < minSize &&
            this.areParagraphsEqual(
                oldParagraphs[startMatches],
                newParagraphs[startMatches],
            )
        ) {
            startMatches++;
        }

        let endMatches = 0;
        while (
            endMatches < minSize - startMatches &&
            this.areParagraphsEqual(
                oldParagraphs[oldSize - 1 - endMatches],
                newParagraphs[newSize - 1 - endMatches],
            )
        ) {
            endMatches++;
        }

        const oldStart = startMatches;
        const oldEnd = oldSize - endMatches;
        const newStart = startMatches;
        const newEnd = newSize - endMatches;

        if (oldEnd - oldStart === newEnd - newStart) {
            for (let i = 0; i < oldEnd - oldStart; i++) {
                if (
                    !this.areParagraphsEqual(
                        oldParagraphs[oldStart + i],
                        newParagraphs[newStart + i],
                    )
                ) {
                    const newPara = newParagraphs[newStart + i];
                    newPara.id = oldParagraphs[oldStart + i].id;
                    deltas.push(
                        new Delta(newPara, newStart + i, DeltaType.Update),
                    );
                }
            }
        } else {
            for (let i = oldStart; i < oldEnd; i++) {
                deltas.push(new Delta(oldParagraphs[i], i, DeltaType.Delete));
            }

            for (let i = newStart; i < newEnd; i++) {
                deltas.push(new Delta(newParagraphs[i], i, DeltaType.Update));
            }
        }

        return deltas.sort((a, b) => a.index - b.index);
    }

    areParagraphsEqual(p1, p2) {
        if (!p1 || !p2) return false;
        if (p1.text !== p2.text || p1.type !== p2.type) return false;
        if (p1.markups.length !== p2.markups.length) return false;

        if (p1.markups.length <= 1) {
            if (p1.markups.length === 0) return true;
            const m1 = p1.markups[0];
            const m2 = p2.markups[0];
            return (
                m1.type === m2.type &&
                m1.start === m2.start &&
                m1.end === m2.end
            );
        }

        const byPosition = (a, b) => {
            if (a.start !== b.start) return a.start - b.start;
            if (a.end !== b.end) return a.end - b.end;
            return a.type.localeCompare(b.type);
        };

        const sortedMarkups1 = [...p1.markups].sort(byPosition);
        const sortedMarkups2 = [...p2.markups].sort(byPosition);

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
        if (str1 === str2) return 1.0;

        const maxLen = Math.max(str1.length, str2.length);
        if (maxLen === 0) return 1.0;

        if (maxLen > 100) {
            // For longer strings, use approximate matching
            return this.approximateSimilarity(str1, str2);
        }

        const distance = this.levenshteinDistance(str1, str2);
        return 1 - distance / maxLen;
    }

    approximateSimilarity(str1, str2) {
        const lenDiff = Math.abs(str1.length - str2.length);
        if (lenDiff > str1.length * 0.5) return 0;

        const freq1 = {};
        const freq2 = {};

        for (const char of str1) {
            freq1[char] = (freq1[char] || 0) + 1;
        }

        for (const char of str2) {
            freq2[char] = (freq2[char] || 0) + 1;
        }

        let common = 0;
        const allChars = new Set([
            ...Object.keys(freq1),
            ...Object.keys(freq2),
        ]);

        for (const char of allChars) {
            common += Math.min(freq1[char] || 0, freq2[char] || 0);
        }

        return common / Math.max(str1.length, str2.length);
    }

    levenshteinDistance(str1, str2) {
        const m = str1.length;
        const n = str2.length;

        if (m === 0) return n;
        if (n === 0) return m;

        let prevRow = new Array(n + 1);
        let curRow = new Array(n + 1);

        for (let j = 0; j <= n; j++) {
            prevRow[j] = j;
        }

        for (let i = 1; i <= m; i++) {
            curRow[0] = i;

            for (let j = 1; j <= n; j++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                curRow[j] = Math.min(
                    prevRow[j] + 1, // deletion
                    curRow[j - 1] + 1, // insertion
                    prevRow[j - 1] + cost, // substitution
                );
            }

            [prevRow, curRow] = [curRow, prevRow];
        }

        return prevRow[n];
    }
}
