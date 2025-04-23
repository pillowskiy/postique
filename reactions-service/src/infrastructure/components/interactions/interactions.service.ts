import { GetBatchStatsOutput } from '@/app/boundaries/dto/output';
import { FindBatchOutput } from '@/app/boundaries/dto/output/stats.dto';
import { FindBatchQuery } from '@/app/queries/interaction/find-batch';
import { GetBatchStatsQuery } from '@/app/queries/interaction/get-batch-stats';
import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

@Injectable()
export class InteractionsService {
  constructor(private readonly _queryBus: QueryBus) {}

  async findBatch(postIds: string[]): Promise<FindBatchOutput> {
    return this._queryBus.execute(new FindBatchQuery(postIds));
  }

  async getBatchStats(
    postIds: string[],
    initiatedBy: string,
  ): Promise<GetBatchStatsOutput> {
    return this._queryBus.execute(new GetBatchStatsQuery(postIds, initiatedBy));
  }
}
