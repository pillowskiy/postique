import { CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Command } from '../../common';
import { ToggleLikeCommand } from './toggle-like.command';
import { LikeRepository } from '@/app/boundaries/repository';
import { ToggleLikeOutput } from '@/app/boundaries/dto/output';
import { LikeEntity } from '@/domain/like';

@CommandHandler(ToggleLikeCommand)
export class ToggleLikeCommandHandler extends Command<
  ToggleLikeCommand,
  ToggleLikeOutput
> {
  @Inject(LikeRepository)
  private readonly _likeRepository: LikeRepository;

  protected async invoke(input: ToggleLikeCommand): Promise<ToggleLikeOutput> {
    const existingLike = await this._likeRepository.findUserLike(
      input.initiatedBy,
      input.targetId,
    );

    let isLiked = false;

    if (existingLike) {
      await this._likeRepository.delete(input.initiatedBy, input.targetId);
      isLiked = false;
    } else {
      const like = LikeEntity.create({
        userId: input.initiatedBy,
        targetId: input.targetId,
      });
      await this._likeRepository.save(like);
      isLiked = true;
    }

    return new ToggleLikeOutput(isLiked);
  }
}
