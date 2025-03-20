import { Post } from '@/app/boundaries/dto/output';
import { PostEntity } from '@/domain/post';

export class PostMapper {
  static toDto(post: PostEntity): Post {
    const postDto = new Post(
      post.id,
      post.visibility,
      post.owner,
      [...post.authors],
      post.slug,
      post.status,
      post.publishedAt,
      post.createdAt,
      post.updatedAt,
    );

    return postDto;
  }
}
