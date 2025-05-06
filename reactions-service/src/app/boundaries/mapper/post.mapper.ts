import { PostEntity } from '@/domain/post';
import { PostOutput } from '../dto/output';

export class PostMapepr {
  static toDto(post: Readonly<PostEntity>): PostOutput {
    return new PostOutput(
      post.id,
      post.title,
      post.description,
      post.coverImage,
    );
  }
}
