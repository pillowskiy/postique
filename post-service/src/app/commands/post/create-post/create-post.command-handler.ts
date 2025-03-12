import { CreatePostOutput } from '@/app/boundaries/dto';
import { PostRepository } from '@/app/boundaries/repository';
import { UserRepository } from '@/app/boundaries/repository/user.repository';
import { Command } from '@/app/commands/common';
import { PostAggregate } from '@/domain/post';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from './create-post.command';

@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler extends Command<
  CreatePostCommand,
  CreatePostOutput
> {
  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  @Inject(UserRepository)
  private readonly _userRepository: UserRepository;

  async invoke({
    visibility,
    owner,
    ...content
  }: CreatePostCommand): Promise<CreatePostOutput> {
    const user = await this._userRepository.getById(owner);
    if (!user) {
      throw new Error('Provided post owner does not exist');
    }

    const post = PostAggregate.create({
      visibility,
      content,
      owner,
    });

    const storedPost = await this._postRepository.getBySlug(post.slug);
    if (storedPost) {
      throw new Error('Post with this slug already exists');
    }

    await this._postRepository.save(post);
    return new CreatePostOutput();
  }
}
