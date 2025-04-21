import { CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Command } from '../../common';
import { CreatePostCommand } from './create-post.command';
import {
  PostInteractionRepository,
  PostRepository,
} from '@/app/boundaries/repository';
import { PostEntity, PostInteractionCounts } from '@/domain/post';
import { CreatePostOutput } from '@/app/boundaries/dto/output';
import { ConflictException } from '@/app/boundaries/errors';

@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler extends Command<
  CreatePostCommand,
  CreatePostOutput
> {
  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  @Inject(PostInteractionRepository)
  private readonly _postInteractionRepository: PostInteractionRepository;

  protected async invoke(input: CreatePostCommand): Promise<CreatePostOutput> {
    const storedPost = await this._postRepository.findById(input.id);
    if (storedPost) {
      throw new ConflictException('Post with this id already exists');
    }

    const post = PostEntity.create(input);
    const postCounts = PostInteractionCounts.empty(post.id);

    await Promise.all([
      this._postRepository.save(post),
      this._postInteractionRepository.save(postCounts),
    ]);

    return new CreatePostOutput(post.id);
  }
}
