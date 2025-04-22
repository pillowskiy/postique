/* eslint-disable no-continue */
/* eslint-disable eqeqeq */
/* eslint-disable no-restricted-syntax */
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
import { DeltaParser } from './parser.js';

export class DeltaApplier {
    static moduleName = 'deltaApplier';

    static parser = new DeltaParser();

    constructor(quill) {
        quill.deltaApplier = this;

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
            'image',
            'blockquote',
            'code-block',
            'codeblock',
        ]);

        this.updatePreviousParagraphs();
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

    updatePreviousParagraphs() {
        this.previousParagraphs = this.getParagraphs();
    }

    getParagraphs() {
        const paragraphs = [];
        const lines = this.quill.getLines(0, this.quill.getLength());

        // eslint-disable-next-line no-restricted-syntax
        for (const line of lines) {
            const lineFormats = line.formats() || {};
            let paragraphType = this.determineParagraphType(lineFormats);
            let codeMetadata;
            let imageMetadata;

            if (lineFormats['code-block'] || lineFormats.code) {
                codeMetadata = new CodeMetadata(
                    lineFormats.language || 'plain',
                    true,
                );
                paragraphType = ParagraphType.Code;
            }

            if (line.constructor.blotName === 'image' || lineFormats.image) {
                let image = line.domNode;
                if (!(image instanceof HTMLImageElement)) {
                    image = image.querySelector('img');
                }

                imageMetadata = new ImageMetadata(
                    image.getAttribute('src'),
                    image.width || 0,
                    image.height || 0,
                );
                paragraphType = ParagraphType.Figure;
            }

            const lineLength = line.length();
            const lineStartIndex = this.quill.getIndex(line);
            const lineText =
                lineLength > 0
                    ? this.quill.getText(lineStartIndex, lineLength - 1)
                    : '';

            const markups = [];

            if (lineLength > 0) {
                const formattedSegments = this.getFormattedSegments(
                    lineStartIndex,
                    lineLength - 1,
                );

                for (const segment of formattedSegments) {
                    for (const formatName of Object.keys(segment.formats)) {
                        if (this.lineFormatKeysSet.has(formatName)) {
                            continue;
                        }

                        const formatType = this.determineMarkupType(formatName);
                        const segmentStart = segment.start - lineStartIndex;
                        const segmentEnd = segment.end - lineStartIndex;

                        if (formatType === null) continue;

                        if (
                            segmentStart >= 0 &&
                            segmentEnd <= lineText.length
                        ) {
                            markups.push(
                                new Markup(
                                    formatType,
                                    segmentStart,
                                    segmentEnd,
                                ),
                            );
                        }
                    }
                }
            }

            paragraphs.push(
                new Paragraph(
                    paragraphType,
                    lineText,
                    markups,
                    imageMetadata,
                    codeMetadata,
                ),
            );
        }

        return paragraphs;
    }

    getFormattedSegments(startIndex, length) {
        const segments = [];
        let index = startIndex;
        const endIndex = startIndex + length;

        while (index < endIndex) {
            const formats = this.quill.getFormat(index, 1);
            let curLength = 1;
            let nextIndex = index + 1;

            while (nextIndex < endIndex) {
                const nextFormats = this.quill.getFormat(nextIndex, 1);
                const formatEqual = this.areFormatsEqual(formats, nextFormats);

                if (!formatEqual) break;

                curLength++;
                nextIndex++;
            }

            segments.push({
                start: index,
                end: index + curLength,
                formats: formats,
            });

            index = nextIndex;
        }

        return segments;
    }

    areFormatsEqual(formats1, formats2) {
        const keys1 = Object.keys(formats1);
        const keys2 = Object.keys(formats2);

        if (keys1.length !== keys2.length) return false;

        for (const key of keys1) {
            if (formats1[key] !== formats2[key]) return false;
        }

        return true;
    }

    determineMarkupType(format) {
        switch (format) {
            case 'bold':
                return MarkupType.Bold;
            case 'italic':
                return MarkupType.Italic;
            case 'underline':
                return MarkupType.Underline;
            case 'strike':
                return MarkupType.Strike;
            case 'code':
                return MarkupType.Code;
            case 'link':
                return MarkupType.Link;
            case 'anchor':
                return MarkupType.Anchor;
            case 'quote':
                return MarkupType.Quote;
            case 'image':
                return MarkupType.Image;
            case 'video':
                return MarkupType.Video;
            case 'newLine':
                return MarkupType.NewLine;
            default:
                return null;
        }
    }

    determineParagraphType(formats) {
        if (formats.postTitle) {
            if (formats.postTitle === 1) {
                return ParagraphType.Title;
            }
            return ParagraphType.Heading;
        }
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
                deltas.push(new Delta(newParagraphs[i], i, DeltaType.Create));
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
            return a.type - b.type;
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
