import { PostOutput } from '@/app/boundaries/dto/output';
import { Query } from '../../common';
import { QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PostRepository } from '@/app/boundaries/repository';
import { GetPostInfoQuery } from './get-post-info.query';
import { NotFoundException } from '@/app/boundaries/errors';
import { PostMapper } from '@/app/boundaries/mapper';

@QueryHandler(GetPostInfoQuery)
export class GetPostInfoQueryHandler extends Query<
  GetPostInfoQuery,
  PostOutput
> {
  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  protected async invoke(input: GetPostInfoQuery): Promise<PostOutput> {
    const storedPost = await this._postRepository.getById(input.id);
    if (!storedPost) {
      throw new NotFoundException('Post does not exist');
    }

    return PostMapper.toDto(storedPost);
  }
}
