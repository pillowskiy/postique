import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { randomUUID } from 'crypto';

import * as input from '@/app/boundaries/dto/input';
import * as output from '@/app/boundaries/dto/output';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly _postsService: PostsService) {}

  @Post()
  async createPost(
    @Body() data: input.CreatePostInput,
  ): Promise<output.CreatePostOutput> {
    return this._postsService.createPost(randomUUID(), data);
  }

  @Patch(':id/visibility')
  async changePostVisibility(
    @Param('id') id: string,
    @Body('visibility') visibility: string,
  ): Promise<output.Post> {
    return this._postsService.changePostVisibility(id, visibility);
  }

  @Patch(':id/archive')
  async archivePost(
    @Param('id') id: string,
  ): Promise<output.ArchivePostOutput> {
    return this._postsService.archivePost(id);
  }

  @Patch(':id/publish')
  async publishPost(@Param('id') id: string): Promise<output.Post> {
    return this._postsService.publishPost(id);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<output.DeletePostOutput> {
    return this._postsService.deletePost(id);
  }

  @Patch(':id/transfer')
  async transferPostOwnership(
    @Param('id') id: string,
    @Body('newOwner') newOwner: string,
  ): Promise<output.TransferPostOwnershipOutput> {
    return this._postsService.transferPostOwnership(id, newOwner);
  }
}
