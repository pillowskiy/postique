import { Post } from '@/app/boundaries/dto/output';
import {
  NotFoundException,
  ValidationException,
} from '@/app/boundaries/errors';
import { PostMapper } from '@/app/boundaries/mapper';
import { PostRepository } from '@/app/boundaries/repository';
import { PostVisibility } from '@/domain/post';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { Command } from '../../common';
import { ChangePostVisibilityCommand } from './change-visibility.command';

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
      throw new NotFoundException('Post does not exist');
    }

    if (!this.#isValidPostVisibility(input.visibility)) {
      throw new ValidationException('Invalid post visibility');
    }

    post.changeVisibility(input.visibility);
    await this._postRepository.save(post);

    return PostMapper.toDto(post);
  }

  #isValidPostVisibility(visibility: string): visibility is PostVisibility {
    return Object.values(PostVisibility).includes(visibility as PostVisibility);
  }
}
