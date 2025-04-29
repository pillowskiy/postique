import {
  Controller,
  Param,
  Post,
  Body,
  UseGuards,
  ParseUUIDPipe,
  Delete,
  Query,
  Get,
} from '@nestjs/common';
import * as input from '@/app/boundaries/dto/input';
import * as output from '@/app/boundaries/dto/output';
import { AuthGuard, OptionalAuthGuard } from '@/infrastructure/common/guards';
import {
  InitiatedBy,
  OptionalInitiatedBy,
} from '@/infrastructure/common/decorators';
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

  @Delete('history')
  @UseGuards(AuthGuard)
  async clearHistory(
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.ClearHistoryOutput> {
    return this._viewsService.clearHistory(initiatedBy, initiatedBy);
  }

  @Delete(':postId')
  @UseGuards(AuthGuard)
  async removeView(
    @Param('postId', ParseUUIDPipe) postId: string,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.RemoveViewOutput> {
    return this._viewsService.removeView(postId, initiatedBy);
  }

  @Get('history')
  @UseGuards(AuthGuard)
  async getUserHistory(
    @InitiatedBy() initiatedBy: string,
    @Query('cursor') cursor?: string,
    @Query('pageSize') pageSize?: number,
  ): Promise<output.ViewOutput[]> {
    return this._viewsService.getUserHistory(initiatedBy, cursor, pageSize);
  }
}
