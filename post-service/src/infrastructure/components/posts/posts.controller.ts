import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import * as input from '@/app/boundaries/dto/input';
import * as output from '@/app/boundaries/dto/output';
import { AuthGuard, OptionalAuthGuard } from '@/infrastructure/common/guards';
import { PostsService } from './posts.service';
import {
  InitiatedBy,
  OptionalInitiatedBy,
} from '@/infrastructure/common/decorators';

@Controller('posts')
export class PostsController {
  constructor(private readonly _postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createPost(
    @Body() data: input.CreatePostInput,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.CreatePostOutput> {
    return this._postsService.createPost(initiatedBy, data);
  }

  @Patch(':id/visibility')
  @UseGuards(AuthGuard)
  async changePostVisibility(
    @Param('id', ParseUUIDPipe) postId: string,
    @Body('visibility') visibility: string,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.PostOutput> {
    return this._postsService.changePostVisibility(
      postId,
      visibility,
      initiatedBy,
    );
  }

  @Patch(':id/archive')
  @UseGuards(AuthGuard)
  async archivePost(
    @Param('id', ParseUUIDPipe) postId: string,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.ArchivePostOutput> {
    return this._postsService.archivePost(postId, initiatedBy);
  }

  @Patch(':id/publish')
  @UseGuards(AuthGuard)
  async publishPost(
    @Param('id', ParseUUIDPipe) postId: string,
    @Body() meta: input.UpdatePostMetadataInput,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.PostOutput> {
    return this._postsService.publishPost(postId, meta, initiatedBy);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deletePost(
    @Param('id', ParseUUIDPipe) postId: string,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.DeletePostOutput> {
    return this._postsService.deletePost(postId, initiatedBy);
  }

  @Patch(':id/transfer')
  @UseGuards(AuthGuard)
  async transferPostOwnership(
    @Param('id', ParseUUIDPipe) postId: string,
    @Body('newOwner') newOwner: string,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.TransferPostOwnershipOutput> {
    return this._postsService.transferPostOwnership(
      postId,
      newOwner,
      initiatedBy,
    );
  }

  @Patch(':id/delta')
  @UseGuards(AuthGuard)
  async deltaSave(
    @Param('id', ParseUUIDPipe) postId: string,
    @Body('deltas') deltas: input.Delta[],
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.DeltaSaveOutput> {
    return this._postsService.deltaSave(postId, deltas, initiatedBy);
  }

  @Get('/cursor')
  @UseGuards(OptionalAuthGuard)
  async getPosts(
    @Query('cursor') cursor: string,
    @Query('take') take: number,
    @OptionalInitiatedBy() initiatedBy: string,
  ): Promise<output.CursorOutput<output.DetailedPostOutput>> {
    return this._postsService.getPosts(initiatedBy, take, cursor);
  }

  @Post('/batch')
  @UseGuards(OptionalAuthGuard)
  async findBatch(
    @Body('ids') ids: string[] = [],
    @OptionalInitiatedBy() initiatedBy: string,
  ): Promise<output.DetailedPostOutput[]> {
    if (!Array.isArray(ids)) {
      throw new BadRequestException('Invalid ids');
    }

    return this._postsService.findBatch(ids, initiatedBy);
  }

  @Get('/:slug')
  async getPost(
    @Param('slug') slug: string,
  ): Promise<output.DetailedPostOutput> {
    return this._postsService.getPost(slug);
  }

  @Get('/:id/info')
  async getPostInfo(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<output.PostOutput> {
    return this._postsService.getPostInfo(id);
  }

  @Get('/:id/draft')
  async getPostDraft(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<output.PostParagraphOutput[]> {
    return this._postsService.getPostDraft(id);
  }

  @Get('/status/:status')
  @UseGuards(AuthGuard)
  async getPostsByStatus(
    @Param('status') status: string,
    @Query('take') take: number,
    @Query('skip') skip: number,
    @InitiatedBy() initiatedBy: string,
  ): Promise<output.DetailedPostOutput[]> {
    switch (status) {
      case 'draft':
        return this._postsService.getDrafts(initiatedBy, take, skip);
      case 'published':
        return this._postsService.getPublished(initiatedBy, take, skip);
      case 'archived':
        return this._postsService.getArchived(initiatedBy, take, skip);
      default:
        throw new BadRequestException('Invalid post status');
    }
  }
}
