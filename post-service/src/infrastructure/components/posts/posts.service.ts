import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  Post,
  ArchivePostOutput,
  TransferPostOwnershipOutput,
  DeletePostOutput,
  CreatePostOutput,
} from '@/app/boundaries/dto/output';
import { CreatePostInput } from '@/app/boundaries/dto/input';

import { CreatePostCommand } from '@/app/commands/post/create';
import { ChangePostVisibilityCommand } from '@/app/commands/post/change-visibility';
import { ArchivePostCommand } from '@/app/commands/post/archive';
import { PublishPostCommand } from '@/app/commands/post/publish';
import { DeletePostCommand } from '@/app/commands/post/delete';
import { TransferPostOwnershipCommand } from '@/app/commands/post/transfer-ownership';

@Injectable()
export class PostsService {
  constructor(private readonly _commandBus: CommandBus) {}

  public async createPost(
    owner: string,
    { title, content, visibility, description }: CreatePostInput,
  ): Promise<CreatePostOutput> {
    return this._commandBus.execute<CreatePostCommand, CreatePostOutput>(
      new CreatePostCommand(title, description, content, owner, visibility),
    );
  }

  public async changePostVisibility(
    postId: string,
    visibility: string,
  ): Promise<Post> {
    return this._commandBus.execute<ChangePostVisibilityCommand, Post>(
      new ChangePostVisibilityCommand(postId, visibility, ''),
    );
  }

  public async archivePost(postId: string): Promise<ArchivePostOutput> {
    return this._commandBus.execute<ArchivePostCommand, ArchivePostOutput>(
      new ArchivePostCommand(postId, ''),
    );
  }

  public async publishPost(postId: string): Promise<Post> {
    return this._commandBus.execute<PublishPostCommand, Post>(
      new PublishPostCommand(postId, ''),
    );
  }

  public async deletePost(postId: string): Promise<DeletePostOutput> {
    return this._commandBus.execute<DeletePostCommand, DeletePostOutput>(
      new DeletePostCommand(postId, ''),
    );
  }

  public async transferPostOwnership(
    postId: string,
    newOwner: string,
  ): Promise<TransferPostOwnershipOutput> {
    return this._commandBus.execute<
      TransferPostOwnershipCommand,
      TransferPostOwnershipOutput
    >(new TransferPostOwnershipCommand(postId, newOwner, ''));
  }
}
