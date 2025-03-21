import { ParagraphAggregate } from '@/domain/content';

export abstract class ParagraphRepository {
  abstract save(paragraph: ParagraphAggregate<any>): Promise<void>;
  abstract delete(id: string): Promise<boolean>;
}
