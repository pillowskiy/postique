import { PostInput } from '@/app/boundaries/dto/input';
import { CreatePostOutput } from '@/app/boundaries/dto/output';
import { CreatePostCommand } from '@/app/commands/post/create';
import { EditPostCommand } from '@/app/commands/post/edit';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class PostsService {
  constructor(private readonly _commandBus: CommandBus) {}

  async createPost(post: PostInput): Promise<CreatePostOutput> {
    return this._commandBus.execute<CreatePostCommand, CreatePostOutput>(
      new CreatePostCommand(
        post.id,
        post.title,
        post.description,
        post.coverImage,
        post.visibility,
        post.status,
      ),
    );
  }

  async editPost(post: PostInput): Promise<CreatePostOutput> {
    return this._commandBus.execute<CreatePostCommand, CreatePostOutput>(
      new EditPostCommand(
        post.id,
        post.title,
        post.description,
        post.coverImage,
        post.visibility,
        post.status,
      ),
    );
  }
}
