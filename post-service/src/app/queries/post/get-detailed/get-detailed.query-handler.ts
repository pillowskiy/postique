import { Post } from '@/app/boundaries/dto/output';
import { Query } from '../../common';
import { QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ContentRepository, PostRepository } from '@/app/boundaries/repository';
import { GetDetailedPostQuery } from './get-detailed.query';
import { NotFoundException } from '@/app/boundaries/errors';
import { PostMapper } from '@/app/boundaries/mapper';
import { ParagraphMapper } from '@/app/boundaries/mapper/paragraph.mapper';

@QueryHandler(GetDetailedPostQuery)
export class GetDetailedPostQueryHandler extends Query<
  GetDetailedPostQuery,
  Post
> {
  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  @Inject(ContentRepository)
  private readonly _contentRepository: ContentRepository;

  protected async invoke(input: GetDetailedPostQuery): Promise<Post> {
    const storedPost = await this._postRepository.getBySlug(input.slug);
    if (!storedPost) {
      throw new NotFoundException('Post does not exist');
    }
    console.log(storedPost);

    const paragraphs = await this._contentRepository.getContentParagraphs(
      storedPost.content,
    );

    console.log(paragraphs);

    const post = PostMapper.toDto(storedPost);
    paragraphs.forEach((p) => post.appendParagraph(ParagraphMapper.toDto(p)));

    return post;
  }
}
