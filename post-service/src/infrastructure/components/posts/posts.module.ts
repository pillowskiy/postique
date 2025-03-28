import {
  ContentRepository,
  ParagraphRepository,
  PostRepository,
  UserRepository,
} from '@/app/boundaries/repository';
import PostCommandHandlers from '@/app/commands/post';
import PostQueryHandlers from '@/app/queries/post';
import { MongoModule } from '@/infrastructure/database/mongo';
import {
  MongoPostRepository,
  MongoUserRepository,
  MongoParagraphRepository,
  MongoContentRepository,
  MongoPreferencesRepository,
} from '@/infrastructure/repository/mongo';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PreferencesRepository } from '@/app/boundaries/repository/preferences.repository';
import { PostAccessControlListModule } from '@/infrastructure/acl/post';

@Module({
  imports: [MongoModule, CqrsModule.forRoot(), PostAccessControlListModule],
  controllers: [PostsController],
  providers: [
    ...PostCommandHandlers,
    ...PostQueryHandlers,
    // TEMP: SRP, remove most of this repository
    {
      provide: PostRepository,
      useClass: MongoPostRepository,
    },
    {
      provide: UserRepository,
      useClass: MongoUserRepository,
    },
    {
      provide: ContentRepository,
      useClass: MongoContentRepository,
    },
    {
      provide: ParagraphRepository,
      useClass: MongoParagraphRepository,
    },
    {
      provide: PreferencesRepository,
      useClass: MongoPreferencesRepository,
    },
    PostsService,
  ],
  exports: [...PostCommandHandlers],
})
export class PostsModule {}
