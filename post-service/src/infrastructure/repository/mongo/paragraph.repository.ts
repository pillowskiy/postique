import { ParagraphRepository } from '@/app/boundaries/repository';
import { ParagraphAggregate } from '@/domain/content';
import { InjectModel, models, Schemas } from '@/infrastructure/database/mongo';
import mongoose from 'mongoose';

export class MongoParagraphRepository extends ParagraphRepository {
  constructor(
    @InjectModel(Schemas.Paragraph)
    private readonly _paragraphModel: models.ParagraphModel,
  ) {
    super();
  }

  async save(paragraph: ParagraphAggregate<any>): Promise<void> {
    await this._paragraphModel.updateOne(
      { _id: paragraph.name },
      {
        $set: {
          type: paragraph.type,
          text: paragraph.text,
          markups: paragraph.markups.map((m) => ({
            _id: new mongoose.Types.ObjectId(),
            type: m.type,
            start: m.start,
            end: m.end,
          })),
          metadata: paragraph.metadata,
          codeMetadata: paragraph.codeMetadata,
        },
      },
      {
        upsert: true,
        strict: false,
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
}
