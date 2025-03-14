import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
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
    console.log('Creating post from incoming', data);
    return this._postsService.createPost(randomUUID(), data);
  }

  @Put(':id/content')
  async changePostContent(
    @Param('id') id: string,
    @Body() data: input.ChangePostContentInput,
  ): Promise<output.Post> {
    console.log('Changing post content from incoming', data);
    return this._postsService.changePostContent(id, data);
  }

  @Patch(':id/visibility')
  async changePostVisibility(
    @Param('id') id: string,
    @Body('visibility') visibility: string,
  ): Promise<output.Post> {
    console.log('Changing post visibility from incoming', visibility);
    return this._postsService.changePostVisibility(id, visibility);
  }

  @Patch(':id/archive')
  async archivePost(
    @Param('id') id: string,
  ): Promise<output.ArchivePostOutput> {
    console.log('Archiving post from incoming');
    return this._postsService.archivePost(id);
  }

  @Patch(':id/publish')
  async publishPost(@Param('id') id: string): Promise<output.Post> {
    console.log('Publishing post from incoming');
    return this._postsService.publishPost(id);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<output.DeletePostOutput> {
    console.log('Deleting post from incoming');
    return this._postsService.deletePost(id);
  }

  @Patch(':id/transfer')
  async transferPostOwnership(
    @Param('id') id: string,
    @Body('newOwner') newOwner: string,
  ): Promise<output.TransferPostOwnershipOutput> {
    console.log('Transferring post ownership from incoming', newOwner);
    return this._postsService.transferPostOwnership(id, newOwner);
  }
}
