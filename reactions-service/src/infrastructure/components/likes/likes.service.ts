import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ToggleLikeOutput } from '@/app/boundaries/dto/output';
import { ToggleLikeCommand } from '@/app/commands/like/toggle-like';

@Injectable()
export class LikesService {
  constructor(private readonly _commandBus: CommandBus) {}

  async toggleLike(
    targetId: string,
    initiatedBy: string,
  ): Promise<ToggleLikeOutput> {
    return this._commandBus.execute<ToggleLikeCommand, ToggleLikeOutput>(
      new ToggleLikeCommand(targetId, initiatedBy),
    );
  }
}
