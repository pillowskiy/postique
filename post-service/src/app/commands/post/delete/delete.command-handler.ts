import { PostAccessControlList } from '@/app/boundaries/acl';
import { DeletePostOutput } from '@/app/boundaries/dto/output';
import { ForbiddenException, NotFoundException } from '@/app/boundaries/errors';
import { PostRepository } from '@/app/boundaries/repository';
import { Command } from '@/app/commands/common';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { DeletePostCommand } from './delete.command';

@CommandHandler(DeletePostCommand)
export class DeletePostCommandHandler extends Command<
  DeletePostCommand,
  DeletePostOutput
> {
  @Inject(PostAccessControlList)
  private readonly _postACL: PostAccessControlList;

  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  protected async invoke(input: DeletePostCommand): Promise<DeletePostOutput> {
    const post = await this._postRepository.getById(input.postId);
    if (!post) {
      throw new NotFoundException('Post does not exist');
    }

    const hasPermission = await this._postACL.canDelete(post.owner, post);
    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to delete this post',
      );
    }

    await this._postRepository.delete(post.id);

    return new DeletePostOutput(post.id);
  }
}
