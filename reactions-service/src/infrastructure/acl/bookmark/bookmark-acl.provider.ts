import { BookmarkAccessControlList } from '@/app/boundaries/acl';
import { BookmarkEntity } from '@/domain/bookmark';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BookmarkAccessControlListProvider extends BookmarkAccessControlList {
  canAdd(userId: string, targetId: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  canDelete(userId: string, bookmark: BookmarkEntity): Promise<boolean> {
    return Promise.resolve(true);
  }

  canModify(userId: string, bookmark: BookmarkEntity): Promise<boolean> {
    return Promise.resolve(true);
  }

  canView(userId: string, targetId: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}
