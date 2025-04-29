import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DrizzleModule } from '@/infrastructure/drizzle';
import { ViewRepository } from '@/app/boundaries/repository';
import ViewCommandHandlers from '@/app/commands/view';
import ViewQueryHandlers from '@/app/queries/view';
import { PostgresViewRepository } from '@/infrastructure/repository/pg';
import { ViewAccessControlListModule } from '@/infrastructure/acl/view';
import { ViewsController } from './views.controller';
import { ViewsService } from './views.service';

@Module({
  imports: [DrizzleModule, CqrsModule.forRoot(), ViewAccessControlListModule],
  controllers: [ViewsController],
  providers: [
    ...ViewCommandHandlers,
    ...ViewQueryHandlers,
    { provide: ViewRepository, useClass: PostgresViewRepository },
    ViewsService,
  ],
})
export class ViewsModule {}
