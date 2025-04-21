import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import PostCommandHandlers from '@/app/commands/post';
import { DrizzleModule } from '@/infrastructure/drizzle';
import {
  PostInteractionRepository,
  PostRepository,
} from '@/app/boundaries/repository';
import {
  PostgresPostInteractionRepository,
  PostgresPostRepository,
} from '@/infrastructure/repository/pg';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [DrizzleModule, CqrsModule.forRoot()],
  controllers: [PostsController],
  providers: [
    ...PostCommandHandlers,
    {
      provide: PostInteractionRepository,
      useClass: PostgresPostInteractionRepository,
    },
    {
      provide: PostRepository,
      useClass: PostgresPostRepository,
    },
    PostsService,
  ],
})
export class PostsModule {}
