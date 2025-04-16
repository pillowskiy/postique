import { SeriesAccessControlList } from '@/app/boundaries/acl';
import { CreateSeriesOutput } from '@/app/boundaries/dto/output';
import { ConflictException, ForbiddenException } from '@/app/boundaries/errors';
import { SeriesRepository } from '@/app/boundaries/repository';
import { PostSeriesEntity } from '@/domain/series';
import { slugify } from '@/libs/slugify';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { Command } from '../../common';
import { CreateSeriesCommand } from './create-series.command';

@CommandHandler(CreateSeriesCommand)
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
      posts: input.posts,
      slug: slugify(input.series.title),
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
