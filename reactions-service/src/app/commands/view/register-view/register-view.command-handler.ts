import { CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Command } from '../../common';
import { RegisterViewCommand } from './register-view.command';
import { ViewRepository } from '@/app/boundaries/repository';
import { RegisterViewOutput } from '@/app/boundaries/dto/output';
import { ViewEntity } from '@/domain/view';

@CommandHandler(RegisterViewCommand)
export class RegisterViewCommandHandler extends Command<
  RegisterViewCommand,
  RegisterViewOutput
> {
  @Inject(ViewRepository)
  private readonly _viewRepository: ViewRepository;

  protected async invoke(
    input: RegisterViewCommand,
  ): Promise<RegisterViewOutput> {
    const view = ViewEntity.create({
      userId: input.initiatedBy ?? undefined,
      targetId: input.targetId,
      createdAt: new Date(),
      readPercentage: input.readPercentage,
      readingTime: input.readingTime,
      referrer: input.referrer,
      userAgent: input.userAgent,
    });

    await this._viewRepository.save(view);

    return new RegisterViewOutput();
  }
}
