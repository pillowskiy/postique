import {
  GetBatchStatsOutput,
  PostStatisticOutput,
} from '@/app/boundaries/dto/output';
import { Query } from '../../common';
import { GetBatchStatsQuery } from './get-batch-stats.query';
import { QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PostStatisticRepository } from '@/app/boundaries/repository';

@QueryHandler(GetBatchStatsQuery)
export class GetBatchStatsQueryHandler extends Query<
  GetBatchStatsQuery,
  GetBatchStatsOutput
> {
  @Inject(PostStatisticRepository)
  private readonly _repo: PostStatisticRepository;

  protected async invoke(
    input: GetBatchStatsQuery,
  ): Promise<GetBatchStatsOutput> {
    const stats = await this._repo.getUserStatistics(
      input.initiatedBy,
      input.postIds,
    );

    return new GetBatchStatsOutput(
      stats.map(
        (s) =>
          new PostStatisticOutput(s.postId, s.liked, s.saved, s.collectionId),
      ),
    );
  }
}
