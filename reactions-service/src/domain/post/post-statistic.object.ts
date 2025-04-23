import { EntityFactory } from '../common/entity';
import { PostStatisticSchema } from './post-statistic.schema';

export class PostStatistic {
  static empty(postId: string): PostStatistic {
    return PostStatistic.create({ postId });
  }

  static create(input: Partial<PostStatistic>): PostStatistic {
    const validPost = EntityFactory.create(PostStatisticSchema, input);

    return new PostStatistic(
      validPost.postId,
      validPost.liked,
      validPost.saved,
      validPost.collectionId,
    );
  }

  private constructor(
    public readonly postId: string,
    public readonly liked: boolean = false,
    public readonly saved: boolean = false,
    public readonly collectionId: string | null = null,
  ) {}
}
