import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  PostOutput,
  ToggleAuthorOutput,
  TogglePostOutput,
  UserOutput,
  PaginatedOutput,
} from '@/app/boundaries/dto/output';
import { ToggleAuthorCommand } from '@/app/commands/preferences/toggle-author';
import { TogglePostCommand } from '@/app/commands/preferences/toggle-post';
import { GetAuthorBlacklistQuery } from '@/app/queries/preferences/get-author-blacklist';
import { GetPostsBlacklistQuery } from '@/app/queries/preferences/get-posts-blacklist';

@Injectable()
export class PreferencesService {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
  ) {}

  async togglePost(postId: string, userId: string): Promise<TogglePostOutput> {
    return this._commandBus.execute<TogglePostCommand, TogglePostOutput>(
      new TogglePostCommand(postId, userId),
    );
  }

  async toggleAuthor(
    authorId: string,
    userId: string,
  ): Promise<ToggleAuthorOutput> {
    return this._commandBus.execute<ToggleAuthorCommand, ToggleAuthorOutput>(
      new ToggleAuthorCommand(authorId, userId),
    );
  }

  async getAuthorBlacklist(
    userId: string,
    take: number,
    skip: number,
  ): Promise<PaginatedOutput<UserOutput>> {
    return this._queryBus.execute<
      GetAuthorBlacklistQuery,
      PaginatedOutput<UserOutput>
    >(new GetAuthorBlacklistQuery(userId, take, skip));
  }

  async getPostsBlacklist(
    userId: string,
    take: number,
    skip: number,
  ): Promise<PaginatedOutput<PostOutput>> {
    return this._queryBus.execute<
      GetPostsBlacklistQuery,
      PaginatedOutput<PostOutput>
    >(new GetPostsBlacklistQuery(userId, take, skip));
  }
}
