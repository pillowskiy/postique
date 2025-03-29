import { TransferPostOwnershipOutput } from '@/app/boundaries/dto/output';
import { ForbiddenException, NotFoundException } from '@/app/boundaries/errors';
import { PostRepository } from '@/app/boundaries/repository';
import { Command } from '@/app/commands/common';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { TransferPostOwnershipCommand } from './transfer-ownership.command';
import { PostAccessControlList } from '@/app/boundaries/acl';

@CommandHandler(TransferPostOwnershipCommand)
export class TransferPostOwnershipCommandHandler extends Command<
  TransferPostOwnershipCommand,
  TransferPostOwnershipOutput
> {
  @Inject(PostAccessControlList)
  private readonly _postACL: PostAccessControlList;

  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  protected async invoke(
    input: TransferPostOwnershipCommand,
  ): Promise<TransferPostOwnershipOutput> {
    const post = await this._postRepository.getById(input.postId);
    if (!post) {
      throw new NotFoundException('Post does not exist');
    }

    const hasPermission = await this._postACL.canTransferOwnership(
      input.initiatedBy,
      post,
    );
    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to transfer ownership of this post',
      );
    }

    post.transferOwnership(input.newOwner);
    await this._postRepository.save(post);

    return new TransferPostOwnershipOutput(post.id);
  }
}
