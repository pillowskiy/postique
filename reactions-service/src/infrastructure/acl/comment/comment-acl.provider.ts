import { CommentAccessControlList } from '@/app/boundaries/acl';
import { CommentEntity } from '@/domain/comment';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentAccessControlListProvider extends CommentAccessControlList {
  canCreate(
    userId: string,
    postId: string,
    parentId?: string,
  ): Promise<boolean> {
    return Promise.resolve(true);
  }

  canModify(userId: string, comment: CommentEntity): Promise<boolean> {
    return Promise.resolve(true);
  }

  canDelete(userId: string, comment: CommentEntity): Promise<boolean> {
    return Promise.resolve(true);
  }
}
