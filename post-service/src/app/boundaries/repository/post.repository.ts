import { PostAggregate } from '@/domain/post';

export abstract class PostRepository {
  abstract save(post: PostAggregate): Promise<void>;
  abstract getBySlug(slug: string): Promise<PostAggregate | null>;
  abstract getById(id: string): Promise<PostAggregate | null>;
  abstract delete(postId: string): Promise<boolean>;
}
