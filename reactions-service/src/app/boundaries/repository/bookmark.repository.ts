import { BookmarkEntity } from '@/domain/bookmark/bookmark.entity';

export abstract class BookmarkRepository {
  abstract findById(id: string): Promise<BookmarkEntity | null>;
  abstract findByUser(userId: string): Promise<BookmarkEntity[]>;
  abstract findByTarget(targetId: string): Promise<BookmarkEntity[]>;
  abstract save(bookmark: BookmarkEntity): Promise<void>;
  abstract delete(bookmarkId: string): Promise<void>;
}
