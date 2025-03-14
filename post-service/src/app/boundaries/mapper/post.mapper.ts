import { PostAggregate } from '@/domain/post';
import { Post } from '@/app/boundaries/dto/output';

export class PostMapper {
  static toDto(post: PostAggregate): Post {
    return new Post(
      post.id,
      post.content.title,
      post.content.description,
      post.content.content,
      post.visibility,
      post.owner,
      [...post.authors],
      post.slug,
      post.status,
      post.publishedAt,
      post.createdAt,
      post.updatedAt,
    );
  }
}
