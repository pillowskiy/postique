import { EntityFactory, IncomingEntity } from '../common/entity';
import { CommentSchema } from './comment.schema';

export class CommentEntity {
  public static create(input: IncomingEntity<CommentEntity>): CommentEntity {
    const validComment = EntityFactory.create(CommentSchema, input);

    return new CommentEntity(
      validComment.id,
      validComment.userId,
      validComment.postId,
      validComment.content,
      validComment.createdAt,
      validComment.updatedAt,
      validComment.parentId,
    );
  }

  protected constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly postId: string,
    private _content: string,
    public readonly createdAt: Date,
    private _updatedAt: Date,
    public readonly parentId?: string,
  ) {}

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get content(): string {
    return this._content;
  }

  isReply(): boolean {
    return !!this.parentId;
  }

  updateContent(content: string): void {
    this._content = content;
    this._updatedAt = new Date();
  }
}
