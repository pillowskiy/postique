import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DrizzleModule } from '@/infrastructure/drizzle';
import { LikeRepository } from '@/app/boundaries/repository';
import LikeCommandHandlers from '@/app/commands/like';
import { PostgresLikeRepository } from '@/infrastructure/repository/pg';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
  imports: [DrizzleModule, CqrsModule.forRoot()],
  controllers: [LikesController],
  providers: [
    ...LikeCommandHandlers,
    { provide: LikeRepository, useClass: PostgresLikeRepository },
    LikesService,
  ],
})
export class LikesModule {}
