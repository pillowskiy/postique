import {
  Controller,
  Param,
  Patch,
  Post,
  Delete,
  Body,
  UseGuards,
  Get,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import * as input from '@/app/boundaries/dto/input';
import * as output from '@/app/boundaries/dto/output';
import { AuthGuard, OptionalAuthGuard } from '@/infrastructure/common/guards';
import {
  InitiatedBy,
  OptionalInitiatedBy,
} from '@/infrastructure/common/decorators';
import { SeriesService } from './series.service';

@Controller('series')
export class SeriesController {
  constructor(private readonly _seriesService: SeriesService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createSeries(
    @Body() series: input.CreateSeriesInput,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.CreateSeriesOutput> {
    return this._seriesService.createSeries(series, initiatedBy);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteSeries(
    @Param('id', ParseUUIDPipe) seriesId: string,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.DeleteSeriesOutput> {
    return this._seriesService.deleteSeries(seriesId, initiatedBy);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateSeries(
    @Param('id', ParseUUIDPipe) seriesId: string,
    @Body() series: input.UpdateSeriesInput,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.UpdateSeriesOutput> {
    return this._seriesService.updateSeries(seriesId, series, initiatedBy);
  }

  @Post(':seriesId/posts/:postId')
  @UseGuards(AuthGuard)
  async addPost(
    @Param('seriesId', ParseUUIDPipe) seriesId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
    @InitiatedBy() initiatedBy: string,
  ): Promise<void> {
    return this._seriesService.addPost(seriesId, postId, initiatedBy);
  }

  @Delete(':seriesId/posts/:postId')
  @UseGuards(AuthGuard)
  async removePost(
    @Param('seriesId', ParseUUIDPipe) seriesId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
    @InitiatedBy() initiatedBy: string,
  ): Promise<void> {
    return this._seriesService.removePost(seriesId, postId, initiatedBy);
  }

  @Get(':slug')
  @UseGuards(OptionalAuthGuard)
  async getDetailed(
    @Param('slug') slug: string,
    @OptionalInitiatedBy() initiatedBy?: string,
  ): Promise<output.DetailedSeriesOutput> {
    return this._seriesService.getDetailed(slug, initiatedBy);
  }

  @Get('users/:userId')
  async getUserSerieses(
    @Query('take') take: number,
    @Query('skip') skip: number,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<output.SeriesOutput[]> {
    return this._seriesService.getUserSerieses(userId, take, skip);
  }

  @Get('posts/:postId')
  @UseGuards(OptionalAuthGuard)
  async getPostSerieses(
    @Param('postId', ParseUUIDPipe) postId: string,
    @OptionalInitiatedBy() initiatedBy?: string,
  ): Promise<output.SeriesOutput[]> {
    return this._seriesService.getPostSerieses(postId, initiatedBy);
  }
}
