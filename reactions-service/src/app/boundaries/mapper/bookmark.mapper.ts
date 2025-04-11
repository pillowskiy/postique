import { BookmarkEntity } from '@/domain/bookmark/bookmark.entity';
import { BookmarkOutput, DetailedBookmarkOutput } from '../dto/output';
import { BookmarkAggregate } from '@/domain/bookmark/bookmark.aggregate';

export class BookmarkMapper {
  static toDto(bookmark: BookmarkEntity): BookmarkOutput {
    return new BookmarkOutput(
      bookmark.id,
      bookmark.userId,
      bookmark.targetId,
      bookmark.collectionId,
      bookmark.createdAt,
      bookmark.updatedAt,
    );
  }

  static toDetailedDto(bookmark: BookmarkAggregate): DetailedBookmarkOutput {
    return new DetailedBookmarkOutput(
      bookmark.id,
      bookmark.userId,
      bookmark.targetId,
      bookmark.post,
      bookmark.collectionId,
      bookmark.createdAt,
      bookmark.updatedAt,
    );
  }
}
