import { BookmarkAggregate } from '@/domain/bookmark/bookmark.aggregate';
import { BookmarkEntity } from '@/domain/bookmark/bookmark.entity';

export abstract class BookmarkRepository {
  abstract findById(id: string): Promise<BookmarkEntity | null>;
  abstract findByUser(
    userId: string,
    cursor?: string,
    pageSize?: number,
  ): Promise<BookmarkAggregate[]>;
  abstract findByCollection(
    collectionId: string,
    cursor?: string,
    pageSize?: number,
  ): Promise<BookmarkAggregate[]>;
  abstract findUserBookmark(
    userId: string,
    targetId: string,
  ): Promise<BookmarkEntity | null>;
  abstract save(bookmark: BookmarkEntity): Promise<void>;
  abstract delete(bookmarkId: string): Promise<void>;
}
