import { CommentEntity } from '@/domain/comment/comment.entity';
import { CommentOutput, DetailedCommentOutput } from '../dto/output';
import { CommentAggregate } from '@/domain/comment';

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

  static toDetailedDto(comment: CommentAggregate): DetailedCommentOutput {
    return new DetailedCommentOutput(
      comment.id,
      comment.userId,
      comment.postId,
      comment.content,
      comment.author,
      comment.createdAt,
      comment.updatedAt,
      comment.parentId,
    );
  }
}
