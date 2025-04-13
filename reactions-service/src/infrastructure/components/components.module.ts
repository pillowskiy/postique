import { Module } from '@nestjs/common';
import { UsersModule } from './users';
import { BookmarksModule } from './bookmarks';
import { CollectionsModule } from './collections';
import { CommentsModule } from './comments';
import { LikesModule } from './likes';
import { ViewsModule } from './views';
import { PostsModule } from './posts';

@Module({
  imports: [
    BookmarksModule,
    CollectionsModule,
    PostsModule,
    CommentsModule,
    LikesModule,
    UsersModule,
    ViewsModule,
  ],
})
export class ComponentsModule {}
