import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import * as input from '@/app/boundaries/dto/input';
import * as output from '@/app/boundaries/dto/output';
import { AuthGuard } from '@/infrastructure/common/guards';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly _postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createPost(
    @Body() data: input.CreatePostInput,
  ): Promise<output.CreatePostOutput> {
    return this._postsService.createPost(randomUUID(), data);
  }

  @Patch(':id/visibility')
  @UseGuards(AuthGuard)
  async changePostVisibility(
    @Param('id') id: string,
    @Body('visibility') visibility: string,
  ): Promise<output.Post> {
    return this._postsService.changePostVisibility(id, visibility);
  }

  @Patch(':id/archive')
  @UseGuards(AuthGuard)
  async archivePost(
    @Param('id') id: string,
  ): Promise<output.ArchivePostOutput> {
    return this._postsService.archivePost(id);
  }

  @Patch(':id/publish')
  @UseGuards(AuthGuard)
  async publishPost(@Param('id') id: string): Promise<output.Post> {
    return this._postsService.publishPost(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deletePost(@Param('id') id: string): Promise<output.DeletePostOutput> {
    return this._postsService.deletePost(id);
  }

  @Patch(':id/transfer')
  @UseGuards(AuthGuard)
  async transferPostOwnership(
    @Param('id') id: string,
    @Body('newOwner') newOwner: string,
  ): Promise<output.TransferPostOwnershipOutput> {
    return this._postsService.transferPostOwnership(id, newOwner);
  }

  @Patch(':id/delta')
  @UseGuards(AuthGuard)
  async deltaSave(
    @Param('id') id: string,
    @Body('deltas') deltas: input.Delta[],
  ) {
    return this._postsService.deltaSave(id, deltas);
  }

  @Get('/cursor')
  async getPosts(
    @Query('cursor') cursor: string,
    @Query('take') take: number,
  ): Promise<output.Cursor<output.Post>> {
    return this._postsService.getPosts(randomUUID(), take, cursor);
  }

  @Get('/:slug')
  async getPost(@Param('slug') slug: string): Promise<output.Post> {
    return this._postsService.getPost(slug);
  }

  @Get('/status/:status')
  async getPostsByStatus(
    @Param('status') status: string,
    @Query('take') take: number,
    @Query('skip') skip: number,
  ): Promise<output.Post[]> {
    switch (status) {
      case 'draft':
        return this._postsService.getDrafts(randomUUID(), take, skip);
      case 'published':
        return this._postsService.getPublished(randomUUID(), take, skip);
      case 'archived':
        return this._postsService.getArchived(randomUUID(), take, skip);
      default:
        throw new BadRequestException('Invalid post status');
    }
  }
}
