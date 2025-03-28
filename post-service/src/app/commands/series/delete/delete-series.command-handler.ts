import { DeleteSeriesOutput } from '@/app/boundaries/dto/output';
import { DeleteSeriesCommand } from './delete-series.command';
import { Command } from '../../common';
import { Inject } from '@nestjs/common';
import { SeriesRepository } from '@/app/boundaries/repository';
import { SeriesAccessControlList } from '@/app/boundaries/acl';
import { ForbiddenException } from '@/app/boundaries/errors';

export class DeleteSeriesCommandHandler extends Command<
  DeleteSeriesCommand,
  DeleteSeriesOutput
> {
  @Inject(SeriesAccessControlList)
  private readonly _seriesACL: SeriesAccessControlList;

  @Inject(SeriesRepository)
  private readonly _seriesRepository: SeriesRepository;

  protected async invoke(
    input: DeleteSeriesCommand,
  ): Promise<DeleteSeriesOutput> {
    const series = await this._seriesRepository.getById(input.seriesId);
    if (!series) {
      throw new Error('Series does not exist');
    }

    const hasPermission = await this._seriesACL.canDelete(
      input.initiatedBy,
      series,
    );
    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to delete this series',
      );
    }

    await this._seriesRepository.delete(series.id);
    return new DeleteSeriesOutput(series.id);
  }
}
