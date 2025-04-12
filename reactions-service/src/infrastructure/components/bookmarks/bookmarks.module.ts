import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  BookmarkRepository,
  UsersRepository,
} from '@/app/boundaries/repository';
import { BookmarkAccessControlListModule } from '@/infrastructure/acl/bookmark';
import BookmarkCommandHandlers from '@/app/commands/bookmark';
import BookmarkQueryHandlers from '@/app/queries/bookmark';
import {
  PostgresBookmarkRepository,
  PostgresUsersRepository,
} from '@/infrastructure/repository/pg';
import { DrizzleModule } from '@/infrastructure/drizzle';

import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';

@Module({
  imports: [
    DrizzleModule,
    CqrsModule.forRoot(),
    BookmarkAccessControlListModule,
  ],
  controllers: [BookmarksController],
  providers: [
    ...BookmarkCommandHandlers,
    ...BookmarkQueryHandlers,
    { provide: BookmarkRepository, useClass: PostgresBookmarkRepository },
    { provide: UsersRepository, useClass: PostgresUsersRepository },
    BookmarksService,
  ],
})
export class BookmarksModule {}
