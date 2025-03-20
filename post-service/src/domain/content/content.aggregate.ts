import { EntityFactory } from '../common/entity';
import { IncomingPostContent, IPostContent } from './content.interface';
import { PostContentSchema } from './content.schema';
import { ParagraphAggregate } from './paragraph/content-paragraph.aggregate';

export class PostContentAggregate implements IPostContent {
  static create(content: IncomingPostContent) {
    const validContent = EntityFactory.create(PostContentSchema, content);
    return new PostContentAggregate(validContent);
  }

  private readonly _coverImage: string | null = null;
  private readonly _title: string;
  private readonly _description: string;
  private readonly _paragraphs: ParagraphAggregate<any>[];
  public readonly createdAt: Date;

  private constructor({
    title,
    description,
    paragraphs,
    createdAt,
  }: IPostContent) {
    this._title = title;
    this._description = description;
    this._paragraphs = paragraphs.map((p) => ParagraphAggregate.create(p));
    this.createdAt = createdAt;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get paragraphs(): ParagraphAggregate<any>[] {
    return this._paragraphs;
  }

  get coverImage(): string | null {
    return this._coverImage;
  }
}
