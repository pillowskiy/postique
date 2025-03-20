import { PostRepository, UserRepository } from '@/app/boundaries/repository';
import PostCommandHandlers from '@/app/commands/post';
import { MongoModule } from '@/infrastructure/database/mongo';
import {
  MongoPostRepository,
  MongoUserRepository,
} from '@/infrastructure/repository/mongo';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [MongoModule, CqrsModule.forRoot()],
  controllers: [PostsController],
  providers: [
    ...PostCommandHandlers,
    {
      provide: PostRepository,
      useClass: MongoPostRepository,
    },
    {
      provide: UserRepository,
      useClass: MongoUserRepository,
    },
    PostsService,
  ],
  exports: [...PostCommandHandlers],
})
export class PostsModule {}
