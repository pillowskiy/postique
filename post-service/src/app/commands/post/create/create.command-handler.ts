import { Logger } from '@/app/boundaries/common';
import { CreatePostOutput } from '@/app/boundaries/dto/output';
import { ConflictException, NotFoundException } from '@/app/boundaries/errors';
import { PostRepository, UserRepository } from '@/app/boundaries/repository';
import { Command } from '@/app/commands/common';
import { PostAggregate } from '@/domain/post';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from './create.command';

@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler extends Command<
  CreatePostCommand,
  CreatePostOutput
> {
  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  @Inject(UserRepository)
  private readonly _userRepository: UserRepository;

  @Inject(Logger)
  private readonly _logger: Logger;

  protected async invoke({
    visibility,
    initiatedBy,
    ...content
  }: CreatePostCommand): Promise<CreatePostOutput> {
    this._logger.assign({ input: { content, visibility, initiatedBy } });
    this._logger.debug?.('Creating post');

    const post = PostAggregate.create({
      visibility,
      content,
      owner: initiatedBy,
    });

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

    await this._postRepository.save(post);
    this._logger.debug?.('Post saved', { post });
    return new CreatePostOutput(post.id);
  }
}
