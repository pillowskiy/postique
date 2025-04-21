import { EntityFactory } from '../common/entity';
import { PostInteractionSchema } from './post-interaction.schema';

export class PostInteractionCounts {
  static empty(postId: string): PostInteractionCounts {
    return PostInteractionCounts.create({ postId });
  }

  static create(input: Partial<PostInteractionCounts>): PostInteractionCounts {
    const validPost = EntityFactory.create(PostInteractionSchema, input);

    return new PostInteractionCounts(
      validPost.postId,
      validPost.viewsCount,
      validPost.likesCount,
      validPost.commentsCount,
      validPost.bookmarksCount,
    );
  }

  private constructor(
    public readonly postId: string,
    public readonly viewsCount: number = 0,
    public readonly likesCount: number = 0,
    public readonly commentsCount: number = 0,
    public readonly bookmarksCount: number = 0,
  ) {}
}
