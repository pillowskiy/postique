import { PostParagraphOutput } from '@/app/boundaries/dto/output';
import { Query } from '../../common';
import { QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ContentRepository, PostRepository } from '@/app/boundaries/repository';
import { GetPostDraftQuery } from './get-post-draft.query';
import { NotFoundException } from '@/app/boundaries/errors';
import { ParagraphMapper } from '@/app/boundaries/mapper';

@QueryHandler(GetPostDraftQuery)
export class GetPostDraftQueryHandler extends Query<
  GetPostDraftQuery,
  PostParagraphOutput[]
> {
  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  @Inject(ContentRepository)
  private readonly _contentRepository: ContentRepository;

  protected async invoke(
    input: GetPostDraftQuery,
  ): Promise<PostParagraphOutput[]> {
    const storedPost = await this._postRepository.getById(input.id);
    if (!storedPost) {
      throw new NotFoundException('Post does not exist');
    }

    const paragraphs = await this._contentRepository.getContentDraftParagraphs(
      storedPost.content,
    );

    return (paragraphs ?? []).map((p) => ParagraphMapper.toDto(p));
  }
}
