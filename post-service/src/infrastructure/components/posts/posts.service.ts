import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  Post,
  ArchivePostOutput,
  TransferPostOwnershipOutput,
  DeletePostOutput,
  CreatePostOutput,
  DeltaSaveOutput,
} from '@/app/boundaries/dto/output';
import { CreatePostInput, Delta } from '@/app/boundaries/dto/input';

import { CreatePostCommand } from '@/app/commands/post/create';
import { ChangePostVisibilityCommand } from '@/app/commands/post/change-visibility';
import { ArchivePostCommand } from '@/app/commands/post/archive';
import { PublishPostCommand } from '@/app/commands/post/publish';
import { DeletePostCommand } from '@/app/commands/post/delete';
import { TransferPostOwnershipCommand } from '@/app/commands/post/transfer-ownership';
import { DeltaSaveCommand } from '@/app/commands/post/delta';

@Injectable()
export class PostsService {
  private readonly initiatorId: string = '5bd6a8f6-2c66-4464-9e35-5cc77ac3a4f8';

  constructor(private readonly _commandBus: CommandBus) {}

  public async createPost(
    owner: string,
    { title, content, visibility, description }: CreatePostInput,
  ): Promise<CreatePostOutput> {
    return this._commandBus.execute<CreatePostCommand, CreatePostOutput>(
      new CreatePostCommand(
        title,
        description,
        content,
        visibility,
        this.initiatorId,
      ),
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

  public async deltaSave(postId: string, deltas: Delta[]) {
    return this._commandBus.execute<DeltaSaveCommand, DeltaSaveOutput>(
      new DeltaSaveCommand(postId, deltas),
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
