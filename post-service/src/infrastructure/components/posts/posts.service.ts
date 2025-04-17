import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  PostOutput,
  DetailedPostOutput,
  ArchivePostOutput,
  TransferPostOwnershipOutput,
  DeletePostOutput,
  CreatePostOutput,
  DeltaSaveOutput,
  CursorOutput,
  PostParagraphOutput,
} from '@/app/boundaries/dto/output';
import { CreatePostInput, Delta } from '@/app/boundaries/dto/input';

import { CreatePostCommand } from '@/app/commands/post/create';
import { ChangePostVisibilityCommand } from '@/app/commands/post/change-visibility';
import { ArchivePostCommand } from '@/app/commands/post/archive';
import { PublishPostCommand } from '@/app/commands/post/publish';
import { DeletePostCommand } from '@/app/commands/post/delete';
import { TransferPostOwnershipCommand } from '@/app/commands/post/transfer-ownership';
import { DeltaSaveCommand } from '@/app/commands/post/delta';
import { GetDetailedPostQuery } from '@/app/queries/post/get-detailed';
import { GetMyPostsQuery } from '@/app/queries/post/get-my-posts';
import { PostStatus } from '@/domain/post';
import { GetPostListQuery } from '@/app/queries/post/get-post-list';
import { GetPostInfoQuery } from '@/app/queries/post/get-info';
import { GetPostDraftQuery } from '@/app/queries/post/get-draft';

@Injectable()
export class PostsService {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
  ) {}

  public async createPost(
    owner: string,
    { title, visibility, description }: CreatePostInput,
  ): Promise<CreatePostOutput> {
    return this._commandBus.execute<CreatePostCommand, CreatePostOutput>(
      new CreatePostCommand(title, description, visibility, owner),
    );
  }

  public async changePostVisibility(
    postId: string,
    visibility: string,
    initiatedBy: string,
  ): Promise<PostOutput> {
    return this._commandBus.execute<ChangePostVisibilityCommand, PostOutput>(
      new ChangePostVisibilityCommand(postId, visibility, initiatedBy),
    );
  }

  public async archivePost(
    postId: string,
    initiatedBy: string,
  ): Promise<ArchivePostOutput> {
    return this._commandBus.execute<ArchivePostCommand, ArchivePostOutput>(
      new ArchivePostCommand(postId, initiatedBy),
    );
  }

  public async publishPost(
    postId: string,
    initiatedBy: string,
  ): Promise<PostOutput> {
    return this._commandBus.execute<PublishPostCommand, PostOutput>(
      new PublishPostCommand(postId, initiatedBy),
    );
  }

  public async deletePost(
    postId: string,
    initiatedBy: string,
  ): Promise<DeletePostOutput> {
    return this._commandBus.execute<DeletePostCommand, DeletePostOutput>(
      new DeletePostCommand(postId, initiatedBy),
    );
  }

  public async deltaSave(postId: string, deltas: Delta[], initiatedBy: string) {
    return this._commandBus.execute<DeltaSaveCommand, DeltaSaveOutput>(
      new DeltaSaveCommand(postId, deltas, initiatedBy),
    );
  }

  public async transferPostOwnership(
    postId: string,
    newOwner: string,
    initiatedBy: string,
  ): Promise<TransferPostOwnershipOutput> {
    return this._commandBus.execute<
      TransferPostOwnershipCommand,
      TransferPostOwnershipOutput
    >(new TransferPostOwnershipCommand(postId, newOwner, initiatedBy));
  }

  public async getPost(slug: string): Promise<DetailedPostOutput> {
    return this._queryBus.execute<GetDetailedPostQuery, DetailedPostOutput>(
      new GetDetailedPostQuery(slug),
    );
  }

  public async getPostInfo(id: string): Promise<PostOutput> {
    return this._queryBus.execute<GetPostInfoQuery, PostOutput>(
      new GetPostInfoQuery(id),
    );
  }

  public async getPostDraft(id: string): Promise<PostParagraphOutput[]> {
    return this._queryBus.execute<GetPostDraftQuery, PostParagraphOutput[]>(
      new GetPostDraftQuery(id),
    );
  }

  public async getPosts(
    userId: string,
    take: number,
    cursor: string = new Date().toISOString(),
  ): Promise<CursorOutput<PostOutput>> {
    return this._queryBus.execute<GetPostListQuery, CursorOutput<PostOutput>>(
      new GetPostListQuery(userId, take, cursor),
    );
  }

  public async getDrafts(
    userId: string,
    take: number,
    skip: number,
  ): Promise<PostOutput[]> {
    return this._getByStatus(PostStatus.Draft, userId, take, skip);
  }

  public async getPublished(
    userId: string,
    take: number,
    skip: number,
  ): Promise<PostOutput[]> {
    return this._getByStatus(PostStatus.Published, userId, take, skip);
  }

  public async getArchived(
    userId: string,
    take: number,
    skip: number,
  ): Promise<PostOutput[]> {
    return this._getByStatus(PostStatus.Archived, userId, take, skip);
  }

  private _getByStatus(
    status: PostStatus,
    userId: string,
    take: number,
    skip: number,
  ): Promise<PostOutput[]> {
    return this._queryBus.execute<GetMyPostsQuery, PostOutput[]>(
      new GetMyPostsQuery(status, userId, take, skip),
    );
  }
}
