import { CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Command } from '../../common';
import { EditPostCommand } from './edit-post.command';
import { PostRepository } from '@/app/boundaries/repository';
import { EditPostOutput } from '@/app/boundaries/dto/output';
import { NotFoundException } from '@/app/boundaries/errors';

@CommandHandler(EditPostCommand)
export class EditPostCommandHandler extends Command<
  EditPostCommand,
  EditPostOutput
> {
  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  protected async invoke(input: EditPostCommand): Promise<EditPostOutput> {
    const post = await this._postRepository.findById(input.id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post.edit(input);
    await this._postRepository.save(post);
    return new EditPostOutput(post.id);
  }
}
