import { DeltaSaveOutput } from '@/app/boundaries/dto/output';
import {
  ParagraphRepository,
  PostRepository,
} from '@/app/boundaries/repository';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { Command } from '../../common';
import { DeltaSaveCommand } from './delta.command';
import { NotFoundException } from '@/app/boundaries/errors';
import { DeltaGroup } from '@/domain/content/delta/delta.entity';
import { ContentChangeStrategy } from '@/domain/content/strategy/delta-update.strategy';
import { Logger } from '@/app/boundaries/common';

@CommandHandler(DeltaSaveCommand)
export class DeltaSaveCommandHandler extends Command<
  DeltaSaveCommand,
  DeltaSaveOutput
> {
  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  @Inject(ParagraphRepository)
  private readonly _paragraphRepository: ParagraphRepository;

  @Inject(Logger)
  private readonly _logger: Logger;

  protected async invoke(input: DeltaSaveCommand): Promise<DeltaSaveOutput> {
    this._logger.assign({ input: { postId: input.postId } });
    this._logger.debug?.('Delta save command invoked');

    const post = await this._postRepository.getById(input.postId);
    if (!post) {
      throw new NotFoundException('Post does not exist');
    }
    this._logger.assign({
      post: {
        id: post.id,
        slug: post.slug,
        paragraphLength: post.paragraphIds.length,
      },
    });
    this._logger.debug?.('Post found');

    const deltaGroup = DeltaGroup.create(input.deltas);
    this._logger.assign({ deltaGroup: { length: deltaGroup.deltas.length } });
    this._logger.debug?.('Delta group created');

    const changeStrategy = new ContentChangeStrategy(post.paragraphIds);
    changeStrategy.applyDeltaGroup(deltaGroup);
    this._logger.assign({
      changeStrategy: { length: changeStrategy.changes().length },
    });

    const paragraphs = await this.applyChanges(changeStrategy);
    this._logger.debug?.('Paragraphs applied');

    post.changeContent(paragraphs);
    await this._postRepository.save(post);

    return new DeltaSaveOutput();
  }

  private async applyChanges(
    strategy: ContentChangeStrategy,
  ): Promise<string[]> {
    await this._paragraphRepository.applyBulk(strategy.changes());
    return strategy.paragraphs();
  }
}
