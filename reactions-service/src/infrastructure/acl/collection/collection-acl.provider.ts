import { BookmarkCollectionAccessControlList } from '@/app/boundaries/acl';
import { BookmarkCollectionEntity } from '@/domain/collection';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BookmarkCollectionAccessControlListProvider extends BookmarkCollectionAccessControlList {
  canCreate(userId: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  canDelete(
    userId: string,
    collection: BookmarkCollectionEntity,
  ): Promise<boolean> {
    return Promise.resolve(true);
  }

  canView(
    userId: string,
    collection: BookmarkCollectionEntity,
  ): Promise<boolean> {
    return Promise.resolve(true);
  }
}
