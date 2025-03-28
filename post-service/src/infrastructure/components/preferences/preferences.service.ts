import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  Post,
  ToggleAuthorOutput,
  TogglePostOutput,
  User,
} from '@/app/boundaries/dto/output';
import { Paginated } from '@/app/boundaries/dto/output/paginated.dto';
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
  ): Promise<Paginated<User>> {
    return this._queryBus.execute<GetAuthorBlacklistQuery, Paginated<User>>(
      new GetAuthorBlacklistQuery(userId, take, skip),
    );
  }

  async getPostsBlacklist(
    userId: string,
    take: number,
    skip: number,
  ): Promise<Paginated<Post>> {
    return this._queryBus.execute<GetPostsBlacklistQuery, Paginated<Post>>(
      new GetPostsBlacklistQuery(userId, take, skip),
    );
  }
}
