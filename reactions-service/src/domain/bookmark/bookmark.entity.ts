import { EntityFactory, IncomingEntity } from '../common/entity';
import { ReactionEntity, ReactionType } from '../reaction/reaction.entity';
import { BookmarkSchema } from './bookmark.schema';

export class BookmarkEntity extends ReactionEntity {
  static create(input: IncomingEntity<BookmarkEntity>): BookmarkEntity {
    const validBookmark = EntityFactory.create(BookmarkSchema, input);

    return new BookmarkEntity(
      validBookmark.id!,
      validBookmark.userId,
      validBookmark.targetId,
      validBookmark.createdAt!,
      validBookmark.updatedAt!,
      validBookmark.collectionId ?? null,
    );
  }

  protected constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly targetId: string,
    createdAt: Date,
    updatedAt: Date,
    private _collectionId: string | null,
  ) {
    super(userId, targetId, createdAt, updatedAt);
  }

  type(): ReactionType {
    return ReactionType.Bookmark;
  }

  get collectionId(): string | null {
    return this._collectionId;
  }

  updateCollection(collectionId: string): void {
    this._collectionId = collectionId;
  }

  removeFromCollection(): void {
    this._collectionId = null;
  }
}
