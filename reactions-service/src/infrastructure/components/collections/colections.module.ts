import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BookmarkCollectionRepository } from '@/app/boundaries/repository';
import { BookmarkCollectionAccessControlListModule } from '@/infrastructure/acl/collection';
import CollectionCommandHandlers from '@/app/commands/collection';
import CollectionQueryHandlers from '@/app/queries/collection';
import { PostgresBookmarkCollectionRepository } from '@/infrastructure/repository/pg/bookmark-collection.repository';
import { DrizzleModule } from '@/infrastructure/drizzle';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';

@Module({
  imports: [
    DrizzleModule,
    CqrsModule.forRoot(),
    BookmarkCollectionAccessControlListModule,
  ],
  controllers: [CollectionsController],
  providers: [
    ...CollectionCommandHandlers,
    ...CollectionQueryHandlers,
    {
      provide: BookmarkCollectionRepository,
      useClass: PostgresBookmarkCollectionRepository,
    },
    CollectionsService,
  ],
})
export class CollectionsModule {}
