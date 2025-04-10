import { CommentEntity } from '@/domain/comment/comment.entity';
import { CommentOutput } from '../dto/output';

export class CommentMapper {
  static toDto(comment: CommentEntity): CommentOutput {
    return new CommentOutput(
      comment.id,
      comment.userId,
      comment.postId,
      comment.content,
      comment.createdAt,
      comment.updatedAt,
      comment.parentId,
    );
  }
}
