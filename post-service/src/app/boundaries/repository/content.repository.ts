import { ParagraphAggregate } from '@/domain/content';

export abstract class ContentRepository {
  abstract getContentParagraphs(
    contentId: string,
  ): Promise<ParagraphAggregate[]>;
  abstract getPlainParagraphs(contentId: string): Promise<string[]>;
  abstract save(contentId: string, paragraphIds: string[]): Promise<void>;
}
