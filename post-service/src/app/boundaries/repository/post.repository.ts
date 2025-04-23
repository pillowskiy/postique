import { PostAggregate, PostEntity, PostStatus } from '@/domain/post';

export type CursorField = keyof Pick<
  PostEntity,
  'id' | 'createdAt' | 'updatedAt'
>;

export type SortField = keyof Pick<PostEntity, 'createdAt' | 'updatedAt'>;

export abstract class PostRepository {
  // Store
  abstract save(post: PostEntity): Promise<void>;
  abstract getBySlug(slug: string): Promise<PostEntity | null>;
  abstract getById(id: string): Promise<PostEntity | null>;
  abstract delete(postId: string): Promise<boolean>;

  // Provider
  abstract loadBySlug(slug: string): Promise<PostAggregate | null>;
  abstract getAllUserPosts(
    userId: string,
    status: PostStatus,
    sortField: SortField,
    take: number,
    skip: number,
  ): Promise<PostAggregate[]>;

  abstract getUserPosts(
    userId: string,
    sortField: SortField,
    take: number,
    skip: number,
  ): Promise<PostAggregate[]>;

  abstract cursor(
    field: CursorField,
    sortField: SortField,
    cursor: string | Date,
  ): AsyncIterable<PostAggregate>;

  abstract cursorFromList(
    postIds: string[],
    field: CursorField,
    sortField: SortField,
    cursor: string | Date,
  ): AsyncIterable<PostAggregate>;

  abstract findManyPosts(ids: string[]): AsyncIterable<PostAggregate>;
}
