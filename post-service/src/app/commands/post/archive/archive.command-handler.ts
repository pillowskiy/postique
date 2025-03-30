import { ArchivePostOutput } from '@/app/boundaries/dto/output';
import { NotFoundException } from '@/app/boundaries/errors';
import { PostRepository } from '@/app/boundaries/repository';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { Command } from '../../common';
import { ArchivePostCommand } from './archive.command';
import { PostAggregate } from '@/domain/post';

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
      throw new NotFoundException('Post does not exist');
    }

    const aggregate = PostAggregate.create(post);
    aggregate.archive();
    await this._postRepository.save(post);

    return new ArchivePostOutput(post.id);
  }
}
