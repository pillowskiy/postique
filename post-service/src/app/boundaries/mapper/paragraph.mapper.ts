import {
  CodeMetadataOutput,
  ImageMetadataOutput,
  PostMarkupOutput,
  PostParagraphOutput,
} from '@/app/boundaries/dto/output';
import { ParagraphAggregate } from '@/domain/content';

export class ParagraphMapper {
  static toDto(paragraph: ParagraphAggregate): PostParagraphOutput {
    const markups = paragraph.markups.map(
      (m) => new PostMarkupOutput(m.type, m.start, m.end, m.href),
    );

    const metadata = paragraph.metadata
      ? new ImageMetadataOutput(
          paragraph.metadata.src,
          paragraph.metadata.originalWidth,
          paragraph.metadata.originalHeight,
        )
      : undefined;

    const codeMetadata = paragraph.codeMetadata
      ? new CodeMetadataOutput(
          paragraph.codeMetadata.lang,
          paragraph.codeMetadata.spellcheck,
        )
      : undefined;

    return new PostParagraphOutput(
      paragraph.id,
      paragraph.type,
      paragraph.text,
      markups,
      metadata,
      codeMetadata,
    );
  }
}
