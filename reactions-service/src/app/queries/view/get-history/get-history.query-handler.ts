import { QueryHandler } from '@nestjs/cqrs';
import { GetHistoryQuery } from './get-history.query';
import { Query } from '../../common';
import { CursorOutput, ViewOutput } from '@/app/boundaries/dto/output';
import { Inject } from '@nestjs/common';
import { ViewRepository } from '@/app/boundaries/repository';

@QueryHandler(GetHistoryQuery)
export class GetHistoryQueryHandler extends Query<
  GetHistoryQuery,
  CursorOutput<ViewOutput>
> {
  @Inject(ViewRepository)
  private readonly _viewRepository: ViewRepository;

  protected async invoke(
    input: GetHistoryQuery,
  ): Promise<CursorOutput<ViewOutput>> {
    const history = await this._viewRepository.getUserHistory(
      input.userId,
      input.cursor,
      input.pageSize,
    );

    return new CursorOutput(
      history,
      history.at(-1)?.createdAt ?? null,
      history.length,
    );
  }
}
