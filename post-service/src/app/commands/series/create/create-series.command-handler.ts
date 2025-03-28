import { CreateSeriesOutput } from '@/app/boundaries/dto/output';
import { Command } from '../../common';
import { CreateSeriesCommand } from './create-series.command';
import { SeriesRepository } from '@/app/boundaries/repository';
import { Inject } from '@nestjs/common';
import { PostSeriesEntity } from '@/domain/series';
import slugify from 'slugify';
import { ConflictException, ForbiddenException } from '@/app/boundaries/errors';
import { SeriesAccessControlList } from '@/app/boundaries/acl';

export class CreateSeriesCommandHandler extends Command<
  CreateSeriesCommand,
  CreateSeriesOutput
> {
  @Inject(SeriesAccessControlList)
  private readonly _seriesACL: SeriesAccessControlList;

  @Inject(SeriesRepository)
  private readonly _seriesRepository: SeriesRepository;

  protected async invoke(
    input: CreateSeriesCommand,
  ): Promise<CreateSeriesOutput> {
    const series = PostSeriesEntity.create({
      title: input.series.title,
      description: input.series.description,
      // TEMP: It is the responsibility of the infrastructure layer.
      slug: slugify(input.series.title, { lower: true, strict: true }),
      owner: input.initiatedBy,
    });

    const hasPermission = await this._seriesACL.canCreate(
      input.initiatedBy,
      series,
    );
    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to create this series',
      );
    }

    const storedSeries = await this._seriesRepository.getBySlug(series.slug);
    if (storedSeries) {
      throw new ConflictException('Series with this slug already exists');
    }

    await this._seriesRepository.save(series);
    return new CreateSeriesOutput(series.id);
  }
}
