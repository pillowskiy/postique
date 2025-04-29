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
  public bookmarksCount: Readonly<number>;
  private _coverImages: string[] = [];

  get coverImages(): Readonly<string[]> {
    return this._coverImages ?? [];
  }

  setBookmarksCount(count: number): void {
    this.bookmarksCount = count;
  }

  appendCoverImage(image: string): void {
    this._coverImages.push(image);
  }

  setAuthor(author: UserEntity): void {
    this.author = author;
  }
}
