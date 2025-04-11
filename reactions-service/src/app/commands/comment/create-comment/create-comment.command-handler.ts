import { CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Command } from '../../common';
import { CommentRepository } from '@/app/boundaries/repository';
import { CommentEntity } from '@/domain/comment';
import { CreateCommentOutput } from '@/app/boundaries/dto/output';
import { CommentAccessControlList } from '@/app/boundaries/acl';
import { ForbiddenException } from '@/app/boundaries/errors';
import { CreateCommentCommand } from './create-comment.command';

@CommandHandler(CreateCommentCommand)
export class CreateCommentCommandHandler extends Command<
  CreateCommentCommand,
  CreateCommentOutput
> {
  @Inject(CommentAccessControlList)
  private readonly _commentACL: CommentAccessControlList;

  @Inject(CommentRepository)
  private readonly _commentRepository: CommentRepository;

  protected async invoke(
    input: CreateCommentCommand,
  ): Promise<CreateCommentOutput> {
    const hasPermission = await this._commentACL.canCreate(
      input.initiatedBy,
      input.postId,
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to comment on this content',
      );
    }

    const comment = CommentEntity.create({
      userId: input.initiatedBy,
      postId: input.postId,
      content: input.content,
    });

    await this._commentRepository.save(comment);

    return new CreateCommentOutput(comment.id);
  }
}
