import { PostEntity, PostStatus } from '@/domain/post';

export type CursorField = keyof Pick<
  PostEntity,
  'id' | 'createdAt' | 'updatedAt'
>;

export type SortField = keyof Pick<PostEntity, 'createdAt' | 'updatedAt'>;

export abstract class PostRepository {
  abstract save(post: PostEntity): Promise<void>;
  abstract getBySlug(slug: string): Promise<PostEntity | null>;
  abstract getById(id: string): Promise<PostEntity | null>;
  abstract delete(postId: string): Promise<boolean>;

  abstract getAllUserPosts(
    userId: string,
    status: PostStatus,
    sortField: SortField,
    take: number,
    skip: number,
  ): Promise<PostEntity[]>;

  abstract getUserPosts(
    userId: string,
    sortField: SortField,
    take: number,
    skip: number,
  ): Promise<PostEntity[]>;

  abstract cursor(
    field: CursorField,
    sortField: SortField,
    cursor: string | Date,
  ): AsyncIterable<PostEntity>;
}
