import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Command } from '../../common';
import { RegisterViewCommand } from './register-view.command';
import { ViewRepository } from '@/app/boundaries/repository';
import { RegisterViewOutput } from '@/app/boundaries/dto/output';
import { ViewEntity } from '@/domain/view';
import { ReactedEvent, ReactionType } from '@/app/events/interaction/reacted';

@CommandHandler(RegisterViewCommand)
export class RegisterViewCommandHandler extends Command<
  RegisterViewCommand,
  RegisterViewOutput
> {
  @Inject(ViewRepository)
  private readonly _viewRepository: ViewRepository;

  @Inject(EventBus)
  private readonly _eventBus: EventBus;

  protected async invoke(
    input: RegisterViewCommand,
  ): Promise<RegisterViewOutput> {
    const storedView = await this._viewRepository.findUserView(
      input.initiatedBy!,
      input.targetId,
    );
    if (storedView) {
      return new RegisterViewOutput();
    }

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

    this._eventBus.publish(
      new ReactedEvent(input.targetId, ReactionType.View, true),
    );

    return new RegisterViewOutput();
  }
}
