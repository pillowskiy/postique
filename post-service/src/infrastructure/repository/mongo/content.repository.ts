import { NotFoundException } from '@/app/boundaries/errors';
import { ContentRepository } from '@/app/boundaries/repository';
import { ParagraphAggregate, IParagraph } from '@/domain/content';
import { InjectModel, models, Schemas } from '@/infrastructure/database/mongo';
import { Paragraph } from '@/infrastructure/database/mongo/schemas';

export class MongoContentRepository extends ContentRepository {
  constructor(
    @InjectModel(Schemas.Content)
    private readonly _contentModel: models.ContentModel,
  ) {
    super();
  }

  async save(contentId: string, paragraphIds: string[]): Promise<void> {
    await this._contentModel.updateOne(
      { _id: contentId },
      {
        $set: {
          paragraphs: paragraphIds,
        },
      },
      {
        upsert: true,
      },
    );
  }

  async getContentParagraphs(contentId: string): Promise<ParagraphAggregate[]> {
    const content = await this._contentModel
      .findOne({ _id: contentId })
      .populate<{ paragraphs: Paragraph[] }>('paragraphs')
      .lean();

    if (!content) {
      throw new NotFoundException('Content does not exist');
    }

    return content.paragraphs.map((p) => this.#getContentParagraph(p));
  }

  async getPlainParagraphs(contentId: string): Promise<string[]> {
    const content = await this._contentModel.findOne({ _id: contentId }).lean();

    if (!content) {
      throw new NotFoundException('Content does not exist');
    }

    return content.paragraphs;
  }

  #getContentParagraph(paragraph: Paragraph): ParagraphAggregate {
    return ParagraphAggregate.create({
      id: paragraph._id.toString(),
      type: paragraph.type,
      text: paragraph.text,
      markups: paragraph.markups,
      metadata: paragraph.metadata,
      codeMetadata: paragraph.codeMetadata,
    } satisfies IParagraph);
  }
}
