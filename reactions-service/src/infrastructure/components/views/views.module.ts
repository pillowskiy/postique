import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DrizzleModule } from '@/infrastructure/drizzle';
import { ViewRepository } from '@/app/boundaries/repository';
import ViewCommandHandlers from '@/app/commands/view';
import { PostgresViewRepository } from '@/infrastructure/repository/pg';
import { ViewsController } from './views.controller';
import { ViewsService } from './views.service';

@Module({
  imports: [DrizzleModule, CqrsModule.forRoot()],
  controllers: [ViewsController],
  providers: [
    ...ViewCommandHandlers,
    { provide: ViewRepository, useClass: PostgresViewRepository },
    ViewsService,
  ],
})
export class ViewsModule {}
