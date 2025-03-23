import { ParagraphRepository } from '@/app/boundaries/repository';
import { BulkOperation, BulkOperationType } from '@/domain/common/bulk';
import { ParagraphAggregate } from '@/domain/content';
import { InjectModel, models, Schemas } from '@/infrastructure/database/mongo';
import { Paragraph } from '@/infrastructure/database/mongo/schemas';
import { AnyBulkWriteOperation } from 'mongoose';

export class MongoParagraphRepository extends ParagraphRepository {
  constructor(
    @InjectModel(Schemas.Paragraph)
    private readonly _paragraphModel: models.ParagraphModel,
  ) {
    super();
  }

  async save(paragraph: ParagraphAggregate): Promise<void> {
    await this._paragraphModel.updateOne(
      { _id: paragraph.id },
      {
        $set: this._paragraphFields(paragraph),
      },
      {
        upsert: true,
      },
    );
  }

  async delete(id: string): Promise<boolean> {
    const query = await this._paragraphModel.deleteOne({ _id: id });
    if (!query.acknowledged) {
      throw new Error('Could not delete paragraph');
    }
    return query.deletedCount === 1;
  }

  async applyBulk(
    operations: BulkOperation<BulkOperationType, ParagraphAggregate>[],
  ): Promise<void> {
    const mongoseOperations = operations
      .map((op): AnyBulkWriteOperation<Paragraph> | null => {
        if (op.isSave()) {
          return {
            updateOne: {
              filter: { _id: op.target },
              update: this._paragraphFields(op.content),
              upsert: true,
            },
          };
        }

        if (op.isDelete()) {
          return {
            deleteOne: {
              filter: { _id: op.target },
            },
          };
        }

        if (op.isInsert()) {
          return {
            insertOne: {
              document: this._paragraphFields(op.content),
            },
          };
        }

        return null;
      })
      .filter((op) => op !== null);

    const res = await this._paragraphModel.bulkWrite(mongoseOperations, {});
    if (!res.isOk) {
      throw new Error(
        `Could not apply bulk operations: ${res
          .getWriteErrors()
          .map((op) => op.toString())
          .join('\n')}`,
      );
    }
  }

  private _paragraphFields(paragraph: ParagraphAggregate): Paragraph {
    return {
      _id: paragraph.id,
      type: paragraph.type,
      text: paragraph.text,
      markups: paragraph.markups.map((m) => ({
        type: m.type,
        start: m.start,
        end: m.end,
      })),
      metadata: paragraph.metadata,
      codeMetadata: paragraph.codeMetadata,
    };
  }
}
