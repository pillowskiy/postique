import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import * as input from '@/app/boundaries/dto/input';
import * as output from '@/app/boundaries/dto/output';
import { AuthGuard } from '@/infrastructure/common/guards';
import { InitiatedBy } from '@/infrastructure/common/decorators';

@Controller('interactions')
export class InteractionsController {
  constructor(private readonly _interactionsService: InteractionsService) {}

  @Post('batch')
  async findBatch(
    @Body() input: input.FindBatchInput,
  ): Promise<output.FindBatchOutput> {
    if (!Array.isArray(input.postIds)) {
      throw new BadRequestException('Invalid postIds');
    }

    return this._interactionsService.findBatch(input.postIds);
  }

  @Post('stats')
  @UseGuards(AuthGuard)
  async getBatchStats(
    @Body() input: input.GetBatchStatsInput,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.GetBatchStatsOutput> {
    if (!Array.isArray(input.postIds)) {
      throw new BadRequestException('Invalid postIds');
    }

    return this._interactionsService.getBatchStats(input.postIds, initiatedBy);
  }
}
