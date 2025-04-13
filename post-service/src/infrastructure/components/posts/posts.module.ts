import {
  ContentRepository,
  ParagraphRepository,
  PostRepository,
  UserRepository,
} from '@/app/boundaries/repository';
import { PreferencesRepository } from '@/app/boundaries/repository/preferences.repository';
import PostCommandHandlers from '@/app/commands/post';
import PostEventHandlers from '@/app/events/post';
import PostQueryHandlers from '@/app/queries/post';
import { PostPreferenceFilterService } from '@/app/services';
import { PostAccessControlListModule } from '@/infrastructure/acl/post';
import { MongoModule } from '@/infrastructure/database/mongo';
import { RabbitMQPostModule } from '@/infrastructure/rabbitmq/post';
import {
  MongoContentRepository,
  MongoParagraphRepository,
  MongoPostRepository,
  MongoPreferencesRepository,
  MongoUserRepository,
} from '@/infrastructure/repository/mongo';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [
    MongoModule,
    CqrsModule.forRoot(),
    RabbitMQPostModule,
    PostAccessControlListModule,
  ],
  controllers: [PostsController],
  providers: [
    ...PostCommandHandlers,
    ...PostQueryHandlers,
    ...PostEventHandlers,
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
    PostPreferenceFilterService,
    PostsService,
  ],
})
export class PostsModule {}
