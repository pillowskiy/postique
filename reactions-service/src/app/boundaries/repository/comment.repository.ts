import { CommentEntity } from '@/domain/comment/comment.entity';

export abstract class CommentRepository {
  abstract findById(id: string): Promise<CommentEntity | null>;
  abstract findByPost(postId: string): Promise<CommentEntity[]>;
  abstract findByParent(parentId: string): Promise<CommentEntity[]>;
  abstract findByUser(userId: string): Promise<CommentEntity[]>;
  abstract save(comment: CommentEntity): Promise<void>;
  abstract delete(commentId: string): Promise<void>;
  abstract countByPost(postId: string): Promise<number>;
}
