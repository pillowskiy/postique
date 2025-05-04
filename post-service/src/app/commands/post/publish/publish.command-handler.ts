import { PostOutput } from '@/app/boundaries/dto/output';
import { NotFoundException } from '@/app/boundaries/errors';
import { PostMapper } from '@/app/boundaries/mapper';
import { ContentRepository, PostRepository } from '@/app/boundaries/repository';
import { Command } from '@/app/commands/common';
import { Inject } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { PublishPostCommand } from './publish.command';
import { PostContentLengthSpecification } from '@/domain/content';
import { DomainBusinessRuleViolation } from '@/domain/common/error';
import { PostPublishedEvent } from '@/app/events/post/post-published';

@CommandHandler(PublishPostCommand)
export class PublishPostCommandHandler extends Command<
  PublishPostCommand,
  PostOutput
> {
  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  @Inject(ContentRepository)
  private readonly _contentRepository: ContentRepository;

  @Inject(EventBus)
  private readonly _eventBus: EventBus;

  protected async invoke(input: PublishPostCommand): Promise<PostOutput> {
    const post = await this._postRepository.getById(input.postId);
    if (!post) {
      throw new NotFoundException('Post does not exist');
    }

    const content = await this._contentRepository.getContentDraftParagraphs(
      post.content,
    );

    const lengthSpec = new PostContentLengthSpecification();
    if (!content || !lengthSpec.isSatisfiedBy(content)) {
      throw new DomainBusinessRuleViolation(
        `Post content is too short, minimum length is ${PostContentLengthSpecification.MIN_LENGTH} characters`,
      );
    }

    post.updateMetadata(input.meta);
    post.publish();

    await this._postRepository.save(post);

    this._eventBus.publish(PostPublishedEvent.fromEntity(post, content));

    return PostMapper.toDto(post);
  }
}
