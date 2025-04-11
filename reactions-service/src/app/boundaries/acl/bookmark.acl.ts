import { BookmarkEntity } from '@/domain/bookmark';

export abstract class BookmarkAccessControlList {
  abstract canAdd(userId: string, targetId: string): Promise<boolean>;
  abstract canDelete(
    userId: string,
    bookmark: BookmarkEntity,
  ): Promise<boolean>;
  abstract canModify(
    userId: string,
    bookmark: BookmarkEntity,
  ): Promise<boolean>;
}
