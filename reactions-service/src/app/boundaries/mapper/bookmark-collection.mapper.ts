import { BookmarkCollectionAggregate } from '@/domain/collection';
import { DetailedBookmarkCollectionOutput } from '../dto/output';
import { UserMapper } from './user-mapper';

export class BookmarkCollectionMapper {
  static toDetailedDto(
    collection: BookmarkCollectionAggregate,
  ): DetailedBookmarkCollectionOutput {
    return new DetailedBookmarkCollectionOutput(
      collection.id,
      collection.userId,
      collection.name,
      collection.description,
      collection.createdAt,
      collection.updatedAt,
      collection.bookmarksCount,
      collection.author ? UserMapper.toDto(collection.author) : undefined,
    );
  }
}
