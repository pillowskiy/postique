import { Logger } from '@/app/boundaries/common';
import { CreatePostOutput } from '@/app/boundaries/dto/output';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@/app/boundaries/errors';
import {
  ContentRepository,
  PostRepository,
  UserRepository,
} from '@/app/boundaries/repository';
import { Command } from '@/app/commands/common';
import { PostEntity, PostVisibility } from '@/domain/post';
import { Inject } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { CreatePostCommand } from './create.command';
import { PostAccessControlList } from '@/app/boundaries/acl';
import { PostCreatedEvent } from '@/app/events/post/post-created';
import { slugify } from '@/libs/slugify';

@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler extends Command<
  CreatePostCommand,
  CreatePostOutput
> {
  @Inject(PostAccessControlList)
  private readonly _postACL: PostAccessControlList;

  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  @Inject(UserRepository)
  private readonly _userRepository: UserRepository;

  @Inject(ContentRepository)
  private readonly _contentRepository: ContentRepository;

  @Inject(EventBus)
  private readonly _eventBus: EventBus;

  @Inject(Logger)
  private readonly _logger: Logger;

  protected async invoke({
    initiatedBy,
    data,
  }: CreatePostCommand): Promise<CreatePostOutput> {
    this._logger.assign({ input: { ...data, initiatedBy } });
    this._logger.debug?.('Creating post');

    const post = PostEntity.create({
      owner: initiatedBy,
      authors: [initiatedBy],
      title: data.title,
      description: data.description,
      coverImage: data.coverImage,
      slug: slugify(data.title),
      visibility: data.visibility ?? PostVisibility.Public.toString(),
    });

    const hasPermission = await this._postACL.canCreate(initiatedBy, post);
    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to create this post',
      );
    }

    const storedPost = await this._postRepository.getBySlug(post.slug);
    if (storedPost) {
      throw new ConflictException('Post with this slug already exists');
    }

    const user = await this._userRepository.getById(initiatedBy);
    if (!user) {
      throw new NotFoundException('Post owner does not exist');
    }
    this._logger.assign({ owner: { username: user.username, id: user.id } });
    this._logger.debug?.('Post owner exists');

    await Promise.all([
      this._contentRepository.save(post.content, []),
      this._postRepository.save(post),
    ]);

    this._eventBus.publish(
      new PostCreatedEvent(
        post.id,
        post.title,
        post.description,
        post.coverImage,
        post.visibility,
        post.status,
      ),
    );

    this._logger.debug?.('Post saved', { post });
    return new CreatePostOutput(post.id);
  }
}
