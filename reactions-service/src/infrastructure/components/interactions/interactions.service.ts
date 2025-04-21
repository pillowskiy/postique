import { FindBatchOutput } from '@/app/boundaries/dto/output/stats.dto';
import { FindBatchQuery } from '@/app/queries/interaction/find-batch';
import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

@Injectable()
export class InteractionsService {
  constructor(private readonly _queryBus: QueryBus) {}

  async findBatch(postIds: string[]): Promise<FindBatchOutput[]> {
    return this._queryBus.execute(new FindBatchQuery(postIds));
  }
}
