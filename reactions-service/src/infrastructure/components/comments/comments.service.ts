import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateCommentOutput,
  DeleteCommentOutput,
  EditCommentOutput,
  DetailedCommentOutput,
  CursorOutput,
} from '@/app/boundaries/dto/output';
import { CreateCommentCommand } from '@/app/commands/comment/create-comment';
import { DeleteCommentCommand } from '@/app/commands/comment/delete-comment';
import { EditCommentCommand } from '@/app/commands/comment/edit-comment';
import { GetPostCommentsQuery } from '@/app/queries/comment/get-comments';
import { GetCommentRepliesQuery } from '@/app/queries/comment/get-replies';

@Injectable()
export class CommentsService {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
  ) {}

  async createComment(
    postId: string,
    content: string,
    initiatedBy: string,
  ): Promise<CreateCommentOutput> {
    return this._commandBus.execute<CreateCommentCommand, CreateCommentOutput>(
      new CreateCommentCommand(postId, content, initiatedBy),
    );
  }

  async deleteComment(
    commentId: string,
    initiatedBy: string,
  ): Promise<DeleteCommentOutput> {
    return this._commandBus.execute<DeleteCommentCommand, DeleteCommentOutput>(
      new DeleteCommentCommand(commentId, initiatedBy),
    );
  }

  async editComment(
    commentId: string,
    content: string,
    initiatedBy: string,
  ): Promise<EditCommentOutput> {
    return this._commandBus.execute<EditCommentCommand, EditCommentOutput>(
      new EditCommentCommand(commentId, content, initiatedBy),
    );
  }

  async getPostComments(
    postId: string,
    requestedBy: string,
    cursor?: string,
    pageSize?: number,
  ): Promise<CursorOutput<DetailedCommentOutput>> {
    return this._queryBus.execute<
      GetPostCommentsQuery,
      CursorOutput<DetailedCommentOutput>
    >(new GetPostCommentsQuery(postId, requestedBy, cursor, pageSize));
  }

  async getCommentReplies(
    commentId: string,
    requestedBy: string,
    cursor?: string,
    pageSize?: number,
  ): Promise<CursorOutput<DetailedCommentOutput>> {
    return this._queryBus.execute<
      GetCommentRepliesQuery,
      CursorOutput<DetailedCommentOutput>
    >(new GetCommentRepliesQuery(commentId, requestedBy, cursor, pageSize));
  }
}
