import { BookmarkCollectionEntity } from '@/domain/collection';

export abstract class BookmarkCollectionAccessControlList {
  abstract canCreate(userId: string): Promise<boolean>;
  abstract canDelete(
    userId: string,
    bookmark: BookmarkCollectionEntity,
  ): Promise<boolean>;
}
