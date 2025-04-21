import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import InteractionEventHandlers from '@/app/events/interaction';
import InteractionQueryHandlers from '@/app/queries/interaction';
import { PostInteractionRepository } from '@/app/boundaries/repository';
import { PostgresPostInteractionRepository } from '@/infrastructure/repository/pg';
import { DrizzleModule } from '@/infrastructure/drizzle';
import { InteractionsService } from './interactions.service';
import { InteractionsController } from './interactions.controller';

@Module({
  controllers: [InteractionsController],
  imports: [DrizzleModule, CqrsModule.forRoot()],
  providers: [
    ...InteractionEventHandlers,
    ...InteractionQueryHandlers,
    InteractionsService,
    {
      provide: PostInteractionRepository,
      useClass: PostgresPostInteractionRepository,
    },
  ],
})
export class InteractionsModule {}
