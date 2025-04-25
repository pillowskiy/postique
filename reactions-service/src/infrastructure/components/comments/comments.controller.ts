import {
  Controller,
  Param,
  Post,
  Delete,
  Body,
  UseGuards,
  Get,
  Patch,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import * as input from '@/app/boundaries/dto/input';
import * as output from '@/app/boundaries/dto/output';
import { AuthGuard } from '@/infrastructure/common/guards';
import { InitiatedBy } from '@/infrastructure/common/decorators';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly _commentsService: CommentsService) {}

  @Post('posts/:postId')
  @UseGuards(AuthGuard)
  async createComment(
    @Body() comment: input.CreateCommentInput,
    @Param('postId', ParseUUIDPipe) postId: string,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.CreateCommentOutput> {
    return this._commentsService.createComment(postId, comment, initiatedBy);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteComment(
    @Param('id', ParseUUIDPipe) commentId: string,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.DeleteCommentOutput> {
    return this._commentsService.deleteComment(commentId, initiatedBy);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async editComment(
    @Param('id', ParseUUIDPipe) commentId: string,
    @Body() comment: input.UpdateCommentInput,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.EditCommentOutput> {
    return this._commentsService.editComment(
      commentId,
      comment.content,
      initiatedBy,
    );
  }

  @Get('posts/:postId')
  @UseGuards(AuthGuard)
  async getPostComments(
    @Param('postId', ParseUUIDPipe) postId: string,
    @InitiatedBy() initiatedBy: string,
    @Query('cursor') cursor?: string,
    @Query('pageSize') pageSize?: number,
  ): Promise<output.CursorOutput<output.DetailedCommentOutput>> {
    return this._commentsService.getPostComments(
      postId,
      initiatedBy,
      cursor,
      pageSize,
    );
  }

  @Get(':commentId/replies')
  @UseGuards(AuthGuard)
  async getCommentReplies(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @InitiatedBy() initiatedBy: string,
    @Query('cursor') cursor?: string,
    @Query('pageSize') pageSize?: number,
  ): Promise<output.CursorOutput<output.DetailedCommentOutput>> {
    return this._commentsService.getCommentReplies(
      commentId,
      initiatedBy,
      cursor,
      pageSize,
    );
  }
}
