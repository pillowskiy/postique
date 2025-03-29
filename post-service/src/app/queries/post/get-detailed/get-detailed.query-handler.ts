import { DetailedPostOutput } from '@/app/boundaries/dto/output';
import { Query } from '../../common';
import { QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ContentRepository, PostRepository } from '@/app/boundaries/repository';
import { GetDetailedPostQuery } from './get-detailed.query';
import { NotFoundException } from '@/app/boundaries/errors';
import { PostMapper } from '@/app/boundaries/mapper';

@QueryHandler(GetDetailedPostQuery)
export class GetDetailedPostQueryHandler extends Query<
  GetDetailedPostQuery,
  DetailedPostOutput
> {
  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  @Inject(ContentRepository)
  private readonly _contentRepository: ContentRepository;

  protected async invoke(
    input: GetDetailedPostQuery,
  ): Promise<DetailedPostOutput> {
    const storedPost = await this._postRepository.getBySlug(input.slug);
    if (!storedPost) {
      throw new NotFoundException('Post does not exist');
    }

    const paragraphs = await this._contentRepository.getContentParagraphs(
      storedPost.content,
    );

    return PostMapper.toDetailedDto(storedPost, paragraphs ?? []);
  }
}
