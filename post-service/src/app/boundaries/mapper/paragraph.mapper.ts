import {
  CodeMetadata,
  ImageMetadata,
  PostMarkup,
  PostParagraph,
} from '@/app/boundaries/dto/output';
import { ParagraphAggregate } from '@/domain/content';

export class ParagraphMapper {
  static toDto(paragraph: ParagraphAggregate): PostParagraph {
    const markups = paragraph.markups.map(
      (m) => new PostMarkup(m.type, m.start, m.end, m.href),
    );

    const metadata = paragraph.metadata
      ? new ImageMetadata(
          paragraph.metadata.src,
          paragraph.metadata.originalWidth,
          paragraph.metadata.originalHeight,
        )
      : undefined;

    const codeMetadata = paragraph.codeMetadata
      ? new CodeMetadata(
          paragraph.codeMetadata.lang,
          paragraph.codeMetadata.spellcheck,
        )
      : undefined;

    return new PostParagraph(
      paragraph.id,
      paragraph.type,
      paragraph.text,
      markups,
      metadata,
      codeMetadata,
    );
  }
}
