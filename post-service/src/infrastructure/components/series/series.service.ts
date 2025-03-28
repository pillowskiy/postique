import {
  CreateSeriesInput,
  UpdateSeriesInput,
} from '@/app/boundaries/dto/input';
import {
  CreateSeriesOutput,
  DeleteSeriesOutput,
  Series,
  UpdateSeriesOutput,
} from '@/app/boundaries/dto/output';
import { AddSeriesPostCommand } from '@/app/commands/series/add-post';
import { CreateSeriesCommand } from '@/app/commands/series/create';
import { DeleteSeriesCommand } from '@/app/commands/series/delete';
import { RemoveSeriesPostCommand } from '@/app/commands/series/remove-post';
import { UpdateSeriesCommand } from '@/app/commands/series/update';
import { GetMySeriesesQuery } from '@/app/queries/series/get-my-serieses';
import { GetPostSeriesesQuery } from '@/app/queries/series/get-post-serieses';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Injectable()
export class SeriesService {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
  ) {}

  async createSeries(
    series: CreateSeriesInput,
    initiatedBy: string,
  ): Promise<CreateSeriesOutput> {
    return this._commandBus.execute<CreateSeriesCommand, CreateSeriesOutput>(
      new CreateSeriesCommand(series, initiatedBy),
    );
  }

  async deleteSeries(
    seriesId: string,
    initiatedBy: string,
  ): Promise<DeleteSeriesOutput> {
    return this._commandBus.execute<DeleteSeriesCommand, DeleteSeriesOutput>(
      new DeleteSeriesCommand(seriesId, initiatedBy),
    );
  }

  async updateSeries(
    seriesId: string,
    series: UpdateSeriesInput,
    initiatedBy: string,
  ): Promise<UpdateSeriesOutput> {
    return this._commandBus.execute<UpdateSeriesCommand, UpdateSeriesOutput>(
      new UpdateSeriesCommand(seriesId, series, initiatedBy),
    );
  }

  async addPost(
    seriesId: string,
    postId: string,
    initiatedBy: string,
  ): Promise<void> {
    return this._commandBus.execute<AddSeriesPostCommand, void>(
      new AddSeriesPostCommand(seriesId, postId, initiatedBy),
    );
  }

  async removePost(
    seriesId: string,
    postId: string,
    initiatedBy: string,
  ): Promise<void> {
    return this._commandBus.execute<RemoveSeriesPostCommand, void>(
      new RemoveSeriesPostCommand(seriesId, postId, initiatedBy),
    );
  }

  async getPostSerieses(postId: string, userId?: string): Promise<Series[]> {
    return this._queryBus.execute<GetPostSeriesesQuery, Series[]>(
      new GetPostSeriesesQuery(postId, userId),
    );
  }

  async getUserSerieses(
    userId: string,
    take: number,
    skip: number,
  ): Promise<Series[]> {
    return this._queryBus.execute<GetMySeriesesQuery, Series[]>(
      new GetMySeriesesQuery(userId, take, skip),
    );
  }
}
