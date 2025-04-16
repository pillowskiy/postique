import { SeriesAccessControlList } from '@/app/boundaries/acl';
import { UpdateSeriesOutput } from '@/app/boundaries/dto/output';
import { ForbiddenException } from '@/app/boundaries/errors';
import { SeriesRepository } from '@/app/boundaries/repository';
import { slugify } from '@/libs/slugify';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { Command } from '../../common';
import { UpdateSeriesCommand } from './update-series.command';

@CommandHandler(UpdateSeriesCommand)
export class UpdateSeriesCommandHandler extends Command<
  UpdateSeriesCommand,
  UpdateSeriesOutput
> {
  @Inject(SeriesAccessControlList)
  private readonly _seriesACL: SeriesAccessControlList;

  @Inject(SeriesRepository)
  private readonly _seriesRepository: SeriesRepository;

  protected async invoke(
    input: UpdateSeriesCommand,
  ): Promise<UpdateSeriesOutput> {
    const series = await this._seriesRepository.getById(input.seriesId);
    if (!series) {
      throw new Error('Series does not exist');
    }

    const hasPermission = await this._seriesACL.canModify(
      input.initiatedBy,
      series,
    );
    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to modify this series',
      );
    }

    if (input.series.title) {
      // TEMP: This probably violates SRP and/or could be an issue for SEO purposes.
      // In the future, we might store old slugs for redirection.
      series.updateTitle(input.series.title, slugify(input.series.title));
    }

    if (input.series.description) {
      series.updateDescription(input.series.description);
    }

    await this._seriesRepository.save(series);
    return new UpdateSeriesOutput(series.id);
  }
}
