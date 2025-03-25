import { Controller, Param, Patch, Post, Delete, Body } from '@nestjs/common';
import { SeriesService } from './series.service';
import * as input from '@/app/boundaries/dto/input';
import * as output from '@/app/boundaries/dto/output';
import { randomUUID } from 'crypto';

@Controller('series')
export class SeriesController {
  constructor(private readonly _seriesService: SeriesService) {}

  @Post()
  async createSeries(
    @Body() series: input.CreateSeriesInput,
  ): Promise<output.CreateSeriesOutput> {
    return this._seriesService.createSeries(series, randomUUID());
  }

  @Delete(':id')
  async deleteSeries(
    @Param('id') seriesId: string,
  ): Promise<output.DeleteSeriesOutput> {
    return this._seriesService.deleteSeries(seriesId, randomUUID());
  }

  @Patch(':id')
  async updateSeries(
    @Param('id') seriesId: string,
    @Body() series: input.UpdateSeriesInput,
  ): Promise<output.UpdateSeriesOutput> {
    return this._seriesService.updateSeries(seriesId, series, randomUUID());
  }

  @Post(':seriesId/posts/:postId')
  async addPost(
    @Param('seriesId') seriesId: string,
    @Param('postId') postId: string,
  ): Promise<void> {
    return this._seriesService.addPost(seriesId, postId, randomUUID());
  }

  @Delete(':seriesId/posts/:postId')
  async removePost(
    @Param('seriesId') seriesId: string,
    @Param('postId') postId: string,
  ): Promise<void> {
    return this._seriesService.removePost(seriesId, postId, randomUUID());
  }
}
