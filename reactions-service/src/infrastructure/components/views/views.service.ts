import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterViewOutput } from '@/app/boundaries/dto/output';
import { RegisterViewCommand } from '@/app/commands/view/register-view';
import { CreateViewInput } from '@/app/boundaries/dto/input';

@Injectable()
export class ViewsService {
  constructor(private readonly _commandBus: CommandBus) {}

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
}
