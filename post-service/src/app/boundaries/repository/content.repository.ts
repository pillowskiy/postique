import { ParagraphAggregate } from '@/domain/content';

export abstract class ContentRepository {
  abstract getContentParagraphs(
    contentId: string,
  ): Promise<ParagraphAggregate[] | null>;
  abstract getContentDraftParagraphs(
    contentId: string,
  ): Promise<ParagraphAggregate[] | null>;
  abstract getPlainParagraphs(contentId: string): Promise<string[]>;
  abstract save(contentId: string, paragraphIds: string[]): Promise<void>;
}
