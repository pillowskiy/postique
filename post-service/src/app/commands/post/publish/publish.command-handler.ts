import { Post } from '@/app/boundaries/dto/output';
import { PostRepository } from '@/app/boundaries/repository';
import { Command } from '@/app/commands/common';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { PublishPostCommand } from './publish.command';
import { PostMapper } from '@/app/boundaries/mapper';

@CommandHandler(PublishPostCommand)
export class PublishPostCommandHandler extends Command<
  PublishPostCommand,
  Post
> {
  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  protected async invoke(input: PublishPostCommand): Promise<Post> {
    const post = await this._postRepository.getById(input.postId);
    if (!post) {
      throw new Error('Post does not exist');
    }

    post.publish();
    await this._postRepository.save(post);

    return PostMapper.toDto(post);
  }
}
