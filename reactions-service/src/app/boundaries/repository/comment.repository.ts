import { CommentAggregate } from '@/domain/comment';
import { CommentEntity } from '@/domain/comment/comment.entity';

export abstract class CommentRepository {
  abstract findById(id: string): Promise<CommentEntity | null>;

  abstract findByPost(
    postId: string,
    cursor?: string,
    pageSize?: number,
  ): Promise<CommentAggregate[]>;

  abstract findByParent(
    postId: string,
    cursor?: string,
    pageSize?: number,
  ): Promise<CommentAggregate[]>;

  abstract save(comment: CommentEntity): Promise<void>;
  abstract delete(commentId: string): Promise<void>;
  abstract countByPost(postId: string): Promise<number>;
}
