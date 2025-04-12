import {
  Controller,
  Param,
  Post,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import * as input from '@/app/boundaries/dto/input';
import * as output from '@/app/boundaries/dto/output';
import { OptionalAuthGuard } from '@/infrastructure/common/guards';
import { OptionalInitiatedBy } from '@/infrastructure/common/decorators';
import { ViewsService } from './views.service';

@Controller('views')
export class ViewsController {
  constructor(private readonly _viewsService: ViewsService) {}

  @Post(':targetId')
  @UseGuards(OptionalAuthGuard)
  async registerView(
    @Param('targetId', ParseUUIDPipe) targetId: string,
    @Body() view: input.CreateViewInput,
    @OptionalInitiatedBy() initiatedBy?: string,
  ): Promise<output.RegisterViewOutput> {
    return this._viewsService.registerView(targetId, initiatedBy || null, view);
  }
}
