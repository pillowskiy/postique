import { Inject } from '@nestjs/common';
import { Command } from '../../common';
import { PostRepository, SeriesRepository } from '@/app/boundaries/repository';
import { AddSeriesPostCommand } from './add-post.command';
import { CommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@/app/boundaries/errors';
import { SeriesAccessControlList } from '@/app/boundaries/acl';

@CommandHandler(AddSeriesPostCommand)
export class AddSeriesPostCommandHandler extends Command<
  AddSeriesPostCommand,
  void
> {
  @Inject(SeriesAccessControlList)
  private readonly _seriesACL: SeriesAccessControlList;

  @Inject(SeriesRepository)
  private readonly _seriesRepository: SeriesRepository;

  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  protected async invoke(input: AddSeriesPostCommand): Promise<void> {
    const series = await this._seriesRepository.getById(input.seriesId);
    if (!series) {
      throw new NotFoundException('Series does not exist');
    }

    const hasPermission = await this._seriesACL.canModify(
      input.initiatedBy,
      series,
    );
    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to modify this series',
      );
    }

    const post = await this._postRepository.getById(input.postId);
    if (!post) {
      throw new NotFoundException('Post to add does not exist');
    }

    series.addPost(post.id);
    await this._seriesRepository.save(series);
  }
}
