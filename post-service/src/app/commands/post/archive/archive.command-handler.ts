import { CommandHandler } from '@nestjs/cqrs';
import { ArchivePostCommand } from './archive.command';
import { Command } from '../../common';
import { ArchivePostOutput } from '@/app/boundaries/dto/output';
import { Inject } from '@nestjs/common';
import { PostRepository } from '@/app/boundaries/repository';

@CommandHandler(ArchivePostCommand)
export class ArchivePostCommandHandler extends Command<
  ArchivePostCommand,
  ArchivePostOutput
> {
  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  protected async invoke(
    input: ArchivePostCommand,
  ): Promise<ArchivePostOutput> {
    const post = await this._postRepository.getById(input.postId);
    if (!post) {
      throw new Error('Post does not exist');
    }

    post.archive();
    await this._postRepository.save(post);

    return new ArchivePostOutput();
  }
}
