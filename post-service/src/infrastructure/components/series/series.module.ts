import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongoModule } from '@/infrastructure/database/mongo';
import SeriesCommandHandlers from '@/app/commands/series';
import { PostRepository, SeriesRepository } from '@/app/boundaries/repository';
import {
  MongoPostRepository,
  MongoSeriesRepository,
} from '@/infrastructure/repository/mongo';
import { SeriesController } from './series.controller';
import { SeriesService } from './series.service';

@Module({
  imports: [MongoModule, CqrsModule.forRoot()],
  controllers: [SeriesController],
  providers: [
    ...SeriesCommandHandlers,
    { provide: SeriesRepository, useClass: MongoSeriesRepository },
    { provide: PostRepository, useClass: MongoPostRepository },
    SeriesService,
  ],
})
export class SeriesModule {}
