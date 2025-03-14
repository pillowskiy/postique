import { CommandHandler } from '@nestjs/cqrs';
import { ChangePostContentCommand } from './change-content.command';
import { Command } from '../../common';
import { Post } from '@/app/boundaries/dto/output';
import { Inject } from '@nestjs/common';
import { PostRepository } from '@/app/boundaries/repository';
import { PostContent } from '@/domain/post';
import { PostMapper } from '@/app/boundaries/mapper';

@CommandHandler(ChangePostContentCommand)
export class ChangePostContentCommandHandler extends Command<
  ChangePostContentCommand,
  Post
> {
  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  protected async invoke({
    postId,
    iniatedBy,
    ...content
  }: ChangePostContentCommand): Promise<Post> {
    const post = await this._postRepository.getById(postId);
    if (!post) {
      throw new Error('Post does not exist');
    }

    const postContent = PostContent.create(content);
    post.changeContent(postContent);
    await this._postRepository.save(post);

    return PostMapper.toDto(post);
  }
}
