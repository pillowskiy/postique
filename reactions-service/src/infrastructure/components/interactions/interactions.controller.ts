import { Body, Controller, Post } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import * as input from '@/app/boundaries/dto/input';
import * as output from '@/app/boundaries/dto/output';

@Controller('interactions')
export class InteractionsController {
  constructor(private readonly _interactionsService: InteractionsService) {}

  @Post('batch')
  async findBatch(
    @Body() input: input.FindBatchInput,
  ): Promise<{ reactions: output.FindBatchOutput[] }> {
    const reactions = await this._interactionsService.findBatch(input.postIds);
    return { reactions };
  }
}
