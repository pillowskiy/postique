import { DeleteSeriesOutput } from '@/app/boundaries/dto/output';
import { DeleteSeriesCommand } from './delete-series.command';
import { Command } from '../../common';
import { Inject } from '@nestjs/common';
import { SeriesRepository } from '@/app/boundaries/repository';

export class DeleteSeriesCommandHandler extends Command<
  DeleteSeriesCommand,
  DeleteSeriesOutput
> {
  @Inject(SeriesRepository)
  private readonly _seriesRepository: SeriesRepository;

  protected async invoke(
    input: DeleteSeriesCommand,
  ): Promise<DeleteSeriesOutput> {
    const series = await this._seriesRepository.getById(input.seriesId);
    if (!series) {
      throw new Error('Series does not exist');
    }

    await this._seriesRepository.delete(series.id);
    return new DeleteSeriesOutput(series.id);
  }
}
