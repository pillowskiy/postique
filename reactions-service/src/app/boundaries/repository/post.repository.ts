import { PostEntity } from '@/domain/post/post.entity';

export abstract class PostRepository {
  abstract findById(id: string): Promise<PostEntity | null>;
  abstract save(post: PostEntity): Promise<void>;
  abstract delete(postId: string): Promise<void>;
}
