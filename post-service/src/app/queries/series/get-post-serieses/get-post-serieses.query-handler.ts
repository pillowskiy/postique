import { Inject } from '@nestjs/common';
import { Query } from '../../common';
import { GetPostSeriesesQuery } from './get-post-serieses.query';
import { SeriesRepository } from '@/app/boundaries/repository';
import { SeriesOutput } from '@/app/boundaries/dto/output';
import { SeriesMapper } from '@/app/boundaries/mapper/series.mapper';

export class GetPostSeriesesQueryHandler extends Query<
  GetPostSeriesesQuery,
  SeriesOutput[]
> {
  @Inject(SeriesRepository)
  private readonly _seriesRepository: SeriesRepository;

  protected async invoke(input: GetPostSeriesesQuery): Promise<SeriesOutput[]> {
    const serieses = await this._seriesRepository.getPostSerieses(
      input.postId,
      input.initiatedBy,
    );

    return serieses.map((series) => SeriesMapper.toDto(series));
  }
}
