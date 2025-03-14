import { CommandHandler } from '@nestjs/cqrs';
import { Command } from '../../common';
import { Post } from '@/app/boundaries/dto/output';
import { Inject } from '@nestjs/common';
import { PostRepository } from '@/app/boundaries/repository';
import { PostMapper } from '@/app/boundaries/mapper';
import { ChangePostVisibilityCommand } from './change-visibility.command';
import { PostVisibility } from '@/domain/post';

@CommandHandler(ChangePostVisibilityCommand)
export class ChangePostVisibilityCommandHandler extends Command<
  ChangePostVisibilityCommand,
  Post
> {
  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  protected async invoke(input: ChangePostVisibilityCommand): Promise<Post> {
    const post = await this._postRepository.getById(input.postId);
    if (!post) {
      throw new Error('Post does not exist');
    }

    if (!this.#isValidPostVisibility(input.visibility)) {
      throw new Error('Invalid post visibility');
    }

    post.changeVisibility(input.visibility);
    await this._postRepository.save(post);

    return PostMapper.toDto(post);
  }

  #isValidPostVisibility(visibility: string): visibility is PostVisibility {
    return Object.values(PostVisibility).includes(visibility as PostVisibility);
  }
}
