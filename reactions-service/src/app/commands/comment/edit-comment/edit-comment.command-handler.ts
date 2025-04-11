import { CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Command } from '../../common';
import { EditCommentCommand } from './edit-comment.command';
import { CommentRepository } from '@/app/boundaries/repository';
import { EditCommentOutput } from '@/app/boundaries/dto/output';
import { CommentAccessControlList } from '@/app/boundaries/acl';
import { ForbiddenException, NotFoundException } from '@/app/boundaries/errors';

@CommandHandler(EditCommentCommand)
export class EditCommentCommandHandler extends Command<
  EditCommentCommand,
  EditCommentOutput
> {
  @Inject(CommentAccessControlList)
  private readonly _commentACL: CommentAccessControlList;

  @Inject(CommentRepository)
  private readonly _commentRepository: CommentRepository;

  protected async invoke(
    input: EditCommentCommand,
  ): Promise<EditCommentOutput> {
    const comment = await this._commentRepository.findById(input.commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const hasPermission = await this._commentACL.canModify(
      input.initiatedBy,
      comment,
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to edit this comment',
      );
    }

    comment.updateContent(input.content);
    await this._commentRepository.save(comment);

    return new EditCommentOutput(
      comment.id,
      comment.content,
      comment.createdAt,
      comment.updatedAt,
    );
  }
}
