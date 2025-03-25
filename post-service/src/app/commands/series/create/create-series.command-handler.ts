import { CreateSeriesOutput } from '@/app/boundaries/dto/output';
import { Command } from '../../common';
import { CreateSeriesCommand } from './create-series.command';
import { SeriesRepository } from '@/app/boundaries/repository';
import { Inject } from '@nestjs/common';
import { PostSeriesEntity } from '@/domain/series';
import slugify from 'slugify';
import { ConflictException } from '@/app/boundaries/errors';

export class CreateSeriesCommandHandler extends Command<
  CreateSeriesCommand,
  CreateSeriesOutput
> {
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
    });

    const storedSeries = await this._seriesRepository.getBySlug(series.slug);
    if (storedSeries) {
      throw new ConflictException('Series with this slug already exists');
    }

    await this._seriesRepository.save(series);
    return new CreateSeriesOutput(series.id);
  }
}
