import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DrizzleModule } from '@/infrastructure/drizzle';
import { CommentRepository } from '@/app/boundaries/repository';
import { CommentAccessControlListModule } from '@/infrastructure/acl/comment';
import CommentCommandHandlers from '@/app/commands/comment';
import CommentQueryHandlers from '@/app/queries/comment';
import { PostgresCommentRepository } from '@/infrastructure/repository/pg';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [
    DrizzleModule,
    CqrsModule.forRoot(),
    CommentAccessControlListModule,
  ],
  controllers: [CommentsController],
  providers: [
    ...CommentCommandHandlers,
    ...CommentQueryHandlers,
    { provide: CommentRepository, useClass: PostgresCommentRepository },
    CommentsService,
  ],
})
export class CommentsModule {}
