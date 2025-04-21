import { FindBatchOutput } from '@/app/boundaries/dto/output/stats.dto';
import { Query } from '../../common';
import { FindBatchQuery } from './find-batch.query';
import { PostInteractionRepository } from '@/app/boundaries/repository';
import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';

@QueryHandler(FindBatchQuery)
export class FindBatchQueryHandler extends Query<
  FindBatchQuery,
  FindBatchOutput
> {
  @Inject(PostInteractionRepository)
  private readonly _repo: PostInteractionRepository;

  protected async invoke(input: FindBatchQuery): Promise<FindBatchOutput> {
    const stats = await this._repo.findBatch(input.postIds);
    return new FindBatchOutput(stats);
  }
}
