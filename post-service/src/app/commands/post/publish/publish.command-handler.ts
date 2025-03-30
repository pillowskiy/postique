import { PostOutput } from '@/app/boundaries/dto/output';
import { NotFoundException } from '@/app/boundaries/errors';
import { PostMapper } from '@/app/boundaries/mapper';
import { ContentRepository, PostRepository } from '@/app/boundaries/repository';
import { Command } from '@/app/commands/common';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { PostAggregate } from '@/domain/post';
import { PublishPostCommand } from './publish.command';

@CommandHandler(PublishPostCommand)
export class PublishPostCommandHandler extends Command<
  PublishPostCommand,
  PostOutput
> {
  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  @Inject(ContentRepository)
  private readonly _contentRepository: ContentRepository;

  protected async invoke(input: PublishPostCommand): Promise<PostOutput> {
    const post = await this._postRepository.getById(input.postId);
    if (!post) {
      throw new NotFoundException('Post does not exist');
    }

    const paragraphs = await this._contentRepository.getContentParagraphs(
      post.content,
    );

    const aggregate = PostAggregate.root(post);
    (paragraphs ?? []).forEach((p) => aggregate.appendParagraph(p));

    aggregate.publish();
    await this._postRepository.save(post);

    return PostMapper.toDto(post);
  }
}
