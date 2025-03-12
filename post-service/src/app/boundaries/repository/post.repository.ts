import { PostAggregate } from '@/domain/post';

export abstract class PostRepository {
  abstract save(post: PostAggregate): Promise<void>;
  abstract getBySlug(slug: string): Promise<PostAggregate | null>;
}
