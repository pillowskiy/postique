import {
  Controller,
  Param,
  Post,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import * as output from '@/app/boundaries/dto/output';
import { AuthGuard } from '@/infrastructure/common/guards';
import { InitiatedBy } from '@/infrastructure/common/decorators';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly _likesService: LikesService) {}

  @Post(':targetId')
  @UseGuards(AuthGuard)
  async toggleLike(
    @Param('targetId', ParseUUIDPipe) targetId: string,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.ToggleLikeOutput> {
    return this._likesService.toggleLike(targetId, initiatedBy);
  }
}
