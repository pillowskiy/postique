import { DeletePostOutput } from '@/app/boundaries/dto/output';
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
  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  protected async invoke(input: DeletePostCommand): Promise<DeletePostOutput> {
    const post = await this._postRepository.getById(input.postId);
    if (!post) {
      throw new Error('Post does not exist');
    }

    await this._postRepository.delete(post.id);

    return new DeletePostOutput(post.id);
  }
}
