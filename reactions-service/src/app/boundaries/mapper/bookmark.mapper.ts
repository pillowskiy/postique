import { BookmarkEntity } from '@/domain/bookmark/bookmark.entity';
import { BookmarkOutput } from '../dto/output';

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
}
