import { PostEntity } from '@/domain/post';

export abstract class PostRepository {
  abstract save(post: PostEntity): Promise<void>;
  abstract getBySlug(slug: string): Promise<PostEntity | null>;
  abstract getById(id: string): Promise<PostEntity | null>;
  abstract delete(postId: string): Promise<boolean>;
}
