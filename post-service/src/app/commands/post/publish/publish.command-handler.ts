import { PostOutput } from '@/app/boundaries/dto/output';
import { NotFoundException } from '@/app/boundaries/errors';
import { PostMapper } from '@/app/boundaries/mapper';
import { PostRepository } from '@/app/boundaries/repository';
import { Command } from '@/app/commands/common';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { PublishPostCommand } from './publish.command';

@CommandHandler(PublishPostCommand)
export class PublishPostCommandHandler extends Command<
  PublishPostCommand,
  PostOutput
> {
  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  protected async invoke(input: PublishPostCommand): Promise<PostOutput> {
    const post = await this._postRepository.getById(input.postId);
    if (!post) {
      throw new NotFoundException('Post does not exist');
    }

    //post.publish();
    await this._postRepository.save(post);

    return PostMapper.toDto(post);
  }
}
