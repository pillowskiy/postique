import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import PostCommandHandlers from '@/app/commands/post';
import { DrizzleModule } from '@/infrastructure/drizzle';
import { PostRepository } from '@/app/boundaries/repository';
import { PostgresPostRepository } from '@/infrastructure/repository/pg';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [DrizzleModule, CqrsModule.forRoot()],
  controllers: [PostsController],
  providers: [
    ...PostCommandHandlers,
    {
      provide: PostRepository,
      useClass: PostgresPostRepository,
    },
    PostsService,
  ],
})
export class PostsModule {}
