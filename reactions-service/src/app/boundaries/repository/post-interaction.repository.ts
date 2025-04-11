import { PostInteractionCounts } from '@/domain/post';

export abstract class PostInteractionRepository {
  abstract findByPostId(postId: string): Promise<PostInteractionCounts | null>;
  abstract save(interaction: PostInteractionCounts): Promise<void>;
  abstract updateLikeCount(postId: string, increment: boolean): Promise<void>;
  abstract updateBookmarkCount(
    postId: string,
    increment: boolean,
  ): Promise<void>;
  abstract updateCommentCount(
    postId: string,
    increment: boolean,
  ): Promise<void>;
  abstract updateViewCount(postId: string): Promise<void>;
}
