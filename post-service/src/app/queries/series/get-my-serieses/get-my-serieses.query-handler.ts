import { Inject } from '@nestjs/common';
import { Query } from '../../common';
import { SeriesRepository } from '@/app/boundaries/repository';
import { Series } from '@/app/boundaries/dto/output';
import { SeriesMapper } from '@/app/boundaries/mapper/series.mapper';
import { GetMySeriesesQuery } from './get-my-serieses.query';

export class GetMySeriesesQueryHandler extends Query<
  GetMySeriesesQuery,
  Series[]
> {
  @Inject(SeriesRepository)
  private readonly _seriesRepository: SeriesRepository;

  protected async invoke(input: GetMySeriesesQuery): Promise<Series[]> {
    const serieses = await this._seriesRepository.getUserSerieses(
      input.userId,
      input.take,
      input.skip,
    );

    return serieses.map((series) => SeriesMapper.toDto(series));
  }
}
