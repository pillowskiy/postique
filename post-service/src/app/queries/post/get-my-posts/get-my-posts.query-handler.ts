import { Post } from '@/app/boundaries/dto/output';
import { Query } from '../../common';
import { GetMyPostsQuery } from './get-my-posts.query';
import { QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PostRepository } from '@/app/boundaries/repository';
import { PostMapper } from '@/app/boundaries/mapper';

@QueryHandler(GetMyPostsQuery)
export class GetMyPostsQueryHandler extends Query<GetMyPostsQuery, Post[]> {
  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  protected async invoke(input: GetMyPostsQuery): Promise<Post[]> {
    const posts = await this._postRepository.getAllUserPosts(
      input.userId,
      input.status,
      'updatedAt',
      input.take,
      input.skip,
    );

    return posts.map((post) => PostMapper.toDto(post));
  }
}
