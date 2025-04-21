import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Command } from '../../common';
import { ToggleLikeCommand } from './toggle-like.command';
import { LikeRepository } from '@/app/boundaries/repository';
import { ToggleLikeOutput } from '@/app/boundaries/dto/output';
import { LikeEntity } from '@/domain/like';
import { ReactedEvent, ReactionType } from '@/app/events/interaction/reacted';

@CommandHandler(ToggleLikeCommand)
export class ToggleLikeCommandHandler extends Command<
  ToggleLikeCommand,
  ToggleLikeOutput
> {
  @Inject(LikeRepository)
  private readonly _likeRepository: LikeRepository;

  @Inject(EventBus)
  private readonly _eventBus: EventBus;

  protected async invoke(input: ToggleLikeCommand): Promise<ToggleLikeOutput> {
    const existingLike = await this._likeRepository.findUserLike(
      input.initiatedBy,
      input.targetId,
    );

    const isLiked = !existingLike;
    if (existingLike) {
      await this._likeRepository.delete(input.initiatedBy, input.targetId);
    } else {
      const like = LikeEntity.create({
        userId: input.initiatedBy,
        targetId: input.targetId,
      });
      await this._likeRepository.save(like);
    }

    this._eventBus.publish(
      new ReactedEvent(input.targetId, ReactionType.Like, isLiked),
    );

    return new ToggleLikeOutput(isLiked);
  }
}
