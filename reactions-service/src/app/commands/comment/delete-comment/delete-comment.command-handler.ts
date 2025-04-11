import { CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Command } from '../../common';
import { DeleteCommentCommand } from './delete-comment.command';
import { CommentRepository } from '@/app/boundaries/repository';
import { DeleteCommentOutput } from '@/app/boundaries/dto/output';
import { CommentAccessControlList } from '@/app/boundaries/acl';
import { ForbiddenException, NotFoundException } from '@/app/boundaries/errors';

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentCommandHandler extends Command<
  DeleteCommentCommand,
  DeleteCommentOutput
> {
  @Inject(CommentAccessControlList)
  private readonly _commentACL: CommentAccessControlList;

  @Inject(CommentRepository)
  private readonly _commentRepository: CommentRepository;

  protected async invoke(
    input: DeleteCommentCommand,
  ): Promise<DeleteCommentOutput> {
    const comment = await this._commentRepository.findById(input.commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const hasPermission = await this._commentACL.canDelete(
      input.initiatedBy,
      comment,
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to delete this comment',
      );
    }

    await this._commentRepository.delete(comment.id);

    return new DeleteCommentOutput(comment.id);
  }
}
