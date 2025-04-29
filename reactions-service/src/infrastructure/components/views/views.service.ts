import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ClearHistoryOutput,
  RegisterViewOutput,
  RemoveViewOutput,
  ViewOutput,
} from '@/app/boundaries/dto/output';
import { RegisterViewCommand } from '@/app/commands/view/register-view';
import { CreateViewInput } from '@/app/boundaries/dto/input';
import { GetHistoryQuery } from '@/app/queries/view/get-history';
import { ClearHistoryCommand } from '@/app/commands/view/clear-history';
import { RemoveViewCommand } from '@/app/commands/view/remove-view';

@Injectable()
export class ViewsService {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
  ) {}

  async registerView(
    targetId: string,
    initiatedBy: string | null,
    view: CreateViewInput,
  ): Promise<RegisterViewOutput> {
    return this._commandBus.execute<RegisterViewCommand, RegisterViewOutput>(
      new RegisterViewCommand(
        targetId,
        initiatedBy,
        view.readPercentage,
        view.readingTime,
        view.referrer,
        view.userAgent,
      ),
    );
  }

  async clearHistory(
    userId: string,
    initiatedBy: string,
  ): Promise<ClearHistoryOutput> {
    return this._commandBus.execute<ClearHistoryCommand, ClearHistoryOutput>(
      new ClearHistoryCommand(userId, initiatedBy),
    );
  }

  async removeView(
    postId: string,
    initiatedBy: string,
  ): Promise<RemoveViewOutput> {
    return this._commandBus.execute<RemoveViewOutput, ClearHistoryOutput>(
      new RemoveViewCommand(postId, initiatedBy),
    );
  }

  async getUserHistory(
    userId: string,
    cursor?: string,
    pageSize?: number,
  ): Promise<ViewOutput[]> {
    return this._queryBus.execute<GetHistoryQuery, ViewOutput[]>(
      new GetHistoryQuery(userId, cursor, pageSize),
    );
  }
}
