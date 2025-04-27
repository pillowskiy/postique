import { UserEntity } from '../user';
import { BookmarkCollectionEntity } from './bookmark-collection.entity';

export class BookmarkCollectionAggregate extends BookmarkCollectionEntity {
  static fromEntity(
    entity: BookmarkCollectionEntity,
  ): BookmarkCollectionAggregate {
    Object.setPrototypeOf(entity, BookmarkCollectionAggregate.prototype);
    return entity as BookmarkCollectionAggregate;
  }

  public author: Readonly<UserEntity>;
  public bookmarksCount: number;

  setBookmarksCount(count: number): void {
    this.bookmarksCount = count;
  }

  setAuthor(author: UserEntity): void {
    this.author = author;
  }
}
