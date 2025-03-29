import { Inject, Injectable } from '@nestjs/common';
import { Transactional } from '@/app/boundaries/common';
import { NotFoundException } from '@/app/boundaries/errors';
import { ContentRepository } from '@/app/boundaries/repository';
import { ParagraphAggregate, IParagraph } from '@/domain/content';
import { InjectModel, models, Schemas } from '@/infrastructure/database/mongo';
import { MongoTransactional } from '@/infrastructure/database/mongo/mongo.transactional';
import { Content, Paragraph } from '@/infrastructure/database/mongo/schemas';

@Injectable()
export class MongoContentRepository extends ContentRepository {
  @InjectModel(Schemas.Content)
  private readonly _contentModel: models.ContentModel;

  @Inject(Transactional)
  private readonly _transactional: MongoTransactional;

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
        session: this._transactional.getSession(undefined),
      },
    );
  }

  async getContentParagraphs(
    contentId: string,
  ): Promise<ParagraphAggregate[] | null> {
    const [content] = await this._contentModel
      .aggregate<{ paragraphs: Paragraph[] }>([
        {
          $match: {
            _id: contentId,
          },
        },
        {
          $lookup: {
            from: Schemas.Paragraph,
            localField: 'paragraphs',
            foreignField: '_id',
            as: 'paragraphs',
          },
        },
        {
          $project: {
            paragraphs: 1,
          },
        },
      ])
      .session(this._transactional.getSession(null));

    if (!content) {
      return null;
    }

    return content.paragraphs.map((p) => this.#getContentParagraph(p));
  }

  async getPlainParagraphs(contentId: string): Promise<string[]> {
    const content = await this._contentModel
      .findOne({ _id: contentId })
      .session(this._transactional.getSession(null))
      .lean();

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
