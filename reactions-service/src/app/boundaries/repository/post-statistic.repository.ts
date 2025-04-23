import { PostStatistic } from '@/domain/post';

export abstract class PostStatisticRepository {
  abstract getUserStatistics(
    userId: string,
    postIds: string[],
  ): Promise<PostStatistic[]>;
}
