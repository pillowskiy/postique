import { CommentEntity } from '@/domain/comment';

export abstract class CommentAccessControlList {
  abstract canCreate(
    userId: string,
    postId: string,
    parentId?: string,
  ): Promise<boolean>;
  abstract canModify(userId: string, comment: CommentEntity): Promise<boolean>;
  abstract canDelete(userId: string, comment: CommentEntity): Promise<boolean>;
}
