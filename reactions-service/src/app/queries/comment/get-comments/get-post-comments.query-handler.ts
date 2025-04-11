import { QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Query } from '../../common';
import { GetPostCommentsQuery } from './get-post-comments.query';
import { CommentRepository } from '@/app/boundaries/repository';
import {
  CursorOutput,
  DetailedCommentOutput,
} from '@/app/boundaries/dto/output';
import { CommentMapper } from '@/app/boundaries/mapper';

@QueryHandler(GetPostCommentsQuery)
export class GetPostCommentsQueryHandler extends Query<
  GetPostCommentsQuery,
  CursorOutput<DetailedCommentOutput>
> {
  @Inject(CommentRepository)
  private readonly _commentRepository: CommentRepository;

  protected async invoke(
    query: GetPostCommentsQuery,
  ): Promise<CursorOutput<DetailedCommentOutput>> {
    const comments = await this._commentRepository.findByPost(
      query.postId,
      query.cursor,
      query.pageSize,
    );

    const commentsDto = comments.map((comment) =>
      CommentMapper.toDetailedDto(comment),
    );

    return new CursorOutput(
      commentsDto,
      comments.at(-1)?.createdAt ?? null,
      comments.length,
    );
  }
}
