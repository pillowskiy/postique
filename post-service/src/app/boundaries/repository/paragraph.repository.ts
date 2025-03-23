import { BulkOperation, BulkOperationType } from '@/domain/common/bulk';
import { ParagraphAggregate } from '@/domain/content';

export abstract class ParagraphRepository {
  abstract save(paragraph: ParagraphAggregate): Promise<void>;
  abstract delete(id: string): Promise<boolean>;
  abstract applyBulk(
    operations: BulkOperation<BulkOperationType, ParagraphAggregate>[],
  ): Promise<void>;
}
