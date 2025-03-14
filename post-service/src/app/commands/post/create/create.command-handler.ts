import { CreatePostOutput } from '@/app/boundaries/dto/output';
import { PostRepository } from '@/app/boundaries/repository';
import { UserRepository } from '@/app/boundaries/repository/user.repository';
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

  protected async invoke({
    visibility,
    initiatedBy,
    ...content
  }: CreatePostCommand): Promise<CreatePostOutput> {
    const post = PostAggregate.create({
      visibility,
      content,
      owner: initiatedBy,
    });

    const user = await this._userRepository.getById(initiatedBy);
    if (!user) {
      throw new Error('Provided post owner does not exist');
    }

    const storedPost = await this._postRepository.getBySlug(post.slug);
    if (storedPost) {
      throw new Error('Post with this slug already exists');
    }

    await this._postRepository.save(post);
    return new CreatePostOutput(post.id);
  }
}
