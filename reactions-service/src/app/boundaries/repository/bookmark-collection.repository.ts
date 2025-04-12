import {
  BookmarkCollectionAggregate,
  BookmarkCollectionEntity,
} from '@/domain/collection';

export abstract class BookmarkCollectionRepository {
  abstract findById(id: string): Promise<BookmarkCollectionEntity | null>;
  abstract findByUser(userId: string): Promise<BookmarkCollectionAggregate[]>;
  abstract save(collection: BookmarkCollectionEntity): Promise<void>;
  abstract delete(collectionId: string): Promise<void>;
}
