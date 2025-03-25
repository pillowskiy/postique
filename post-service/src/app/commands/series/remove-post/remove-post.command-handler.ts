import { Inject } from '@nestjs/common';
import { Command } from '../../common';
import { PostRepository, SeriesRepository } from '@/app/boundaries/repository';
import { CommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@/app/boundaries/errors';
import { RemoveSeriesPostCommand } from './remove-post.command';

@CommandHandler(RemoveSeriesPostCommand)
export class RemoveSeriesPostCommandHandler extends Command<
  RemoveSeriesPostCommand,
  void
> {
  @Inject(SeriesRepository)
  private readonly _seriesRepository: SeriesRepository;

  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  protected async invoke(input: RemoveSeriesPostCommand): Promise<void> {
    const series = await this._seriesRepository.getById(input.seriesId);
    if (!series) {
      throw new NotFoundException('Series does not exist');
    }

    const post = await this._postRepository.getById(input.postId);
    if (!post) {
      throw new NotFoundException('Post to add does not exist');
    }

    series.removePost(post.id);
    await this._seriesRepository.save(series);
  }
}
