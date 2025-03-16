import { Post } from '@/app/boundaries/dto/output';
import { NotFoundException } from '@/app/boundaries/errors';
import { PostMapper } from '@/app/boundaries/mapper';
import { PostRepository } from '@/app/boundaries/repository';
import { PostContent } from '@/domain/post';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { Command } from '../../common';
import { ChangePostContentCommand } from './change-content.command';

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
      throw new NotFoundException('Post does not exist');
    }

    const postContent = PostContent.create(content);
    post.changeContent(postContent);
    await this._postRepository.save(post);

    return PostMapper.toDto(post);
  }
}
