import { BookmarkAggregate } from '@/domain/bookmark/bookmark.aggregate';
import { BookmarkEntity } from '@/domain/bookmark/bookmark.entity';
import { BookmarkOutput, DetailedBookmarkOutput } from '../dto/output';
import { PostMapepr } from './post.mapper';

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
      PostMapepr.toDto(bookmark.post),
      bookmark.collectionId,
      bookmark.createdAt,
      bookmark.updatedAt,
    );
  }
}
