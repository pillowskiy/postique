import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongoModule } from '@/infrastructure/database/mongo';
import {
  PostRepository,
  PreferencesRepository,
  SeriesRepository,
} from '@/app/boundaries/repository';
import {
  MongoPostRepository,
  MongoSeriesRepository,
} from '@/infrastructure/repository/mongo';
import { SeriesController } from './series.controller';
import { SeriesService } from './series.service';
import { SeriesAccessControlListModule } from '@/infrastructure/acl/series';
import { PostPreferenceFilterService } from '@/app/services';
import SeriesCommandHandlers from '@/app/commands/series';
import SeriesQueryHandlers from '@/app/queries/series';

@Module({
  imports: [MongoModule, CqrsModule.forRoot(), SeriesAccessControlListModule],
  controllers: [SeriesController],
  providers: [
    ...SeriesCommandHandlers,
    ...SeriesQueryHandlers,
    { provide: SeriesRepository, useClass: MongoSeriesRepository },
    { provide: PostRepository, useClass: MongoPostRepository },
    { provide: PreferencesRepository, useClass: MongoPostRepository },
    PostPreferenceFilterService,
    SeriesService,
  ],
})
export class SeriesModule {}
