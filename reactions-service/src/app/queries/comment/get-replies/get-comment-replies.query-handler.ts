import { QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Query } from '../../common';
import { GetCommentRepliesQuery } from './get-comment-replies.query';
import { CommentRepository } from '@/app/boundaries/repository';
import {
  CursorOutput,
  DetailedCommentOutput,
} from '@/app/boundaries/dto/output';
import { CommentMapper } from '@/app/boundaries/mapper';

@QueryHandler(GetCommentRepliesQuery)
export class GetCommentRepliesQueryHandler extends Query<
  GetCommentRepliesQuery,
  CursorOutput<DetailedCommentOutput>
> {
  @Inject(CommentRepository)
  private readonly _commentRepository: CommentRepository;

  protected async invoke(
    query: GetCommentRepliesQuery,
  ): Promise<CursorOutput<DetailedCommentOutput>> {
    const replies = await this._commentRepository.findByParent(
      query.commentId,
      query.cursor,
      query.pageSize,
    );

    const repliesDto = replies.map((comment) =>
      CommentMapper.toDetailedDto(comment),
    );

    return new CursorOutput(
      repliesDto,
      replies.at(-1)?.createdAt ?? null,
      replies.length,
    );
  }
}
