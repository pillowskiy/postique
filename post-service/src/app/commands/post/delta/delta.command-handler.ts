import { DeltaSaveOutput } from '@/app/boundaries/dto/output';
import {
  ContentRepository,
  ParagraphRepository,
  PostRepository,
} from '@/app/boundaries/repository';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { Command } from '../../common';
import { DeltaSaveCommand } from './delta.command';
import { NotFoundException, ForbiddenException } from '@/app/boundaries/errors';
import { DeltaGroup } from '@/domain/content/delta/delta.entity';
import { ContentChangeStrategy } from '@/domain/content/strategy/delta-update.strategy';
import { Logger } from '@/app/boundaries/common';
import { PostAccessControlList } from '@/app/boundaries/acl';
import { PostStatus } from '@/domain/post';

@CommandHandler(DeltaSaveCommand)
export class DeltaSaveCommandHandler extends Command<
  DeltaSaveCommand,
  DeltaSaveOutput
> {
  @Inject(PostAccessControlList)
  private readonly _postACL: PostAccessControlList;

  @Inject(PostRepository)
  private readonly _postRepository: PostRepository;

  @Inject(ParagraphRepository)
  private readonly _paragraphRepository: ParagraphRepository;

  @Inject(ContentRepository)
  private readonly _contentRepository: ContentRepository;

  @Inject(Logger)
  private readonly _logger: Logger;

  protected async invoke(input: DeltaSaveCommand): Promise<DeltaSaveOutput> {
    this._logger.assign({ input: { postId: input.postId } });
    this._logger.debug?.('Delta save command invoked');

    const post = await this._postRepository.getById(input.postId);
    if (!post) {
      throw new NotFoundException('Post does not exist');
    }

    const hasPermission = await this._postACL.canModify(post.owner, post);
    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to modify this post',
      );
    }
    this._logger.debug?.(`User has permission to modify post ${post.id}`);

    const paragraphIds = await this._contentRepository.getPlainParagraphs(
      post.content,
    );

    this._logger.assign({
      post: {
        id: post.id,
        slug: post.slug,
        paragraphLength: paragraphIds.length,
      },
    });
    this._logger.debug?.('Post found');

    const deltaGroup = DeltaGroup.create(input.deltas);
    this._logger.assign({ deltaGroup: { length: deltaGroup.deltas.length } });
    this._logger.debug?.('Delta group created');

    const changeStrategy = new ContentChangeStrategy(paragraphIds);
    changeStrategy.applyDeltaGroup(deltaGroup);
    this._logger.assign({
      changeStrategy: { length: changeStrategy.changes().length },
    });

    const paragraphs = await this.applyChanges(changeStrategy);
    this._logger.debug?.('Paragraphs applied');

    const promises: Promise<any>[] = [
      this._contentRepository.save(post.content, paragraphs),
    ];

    // TEMP: This should be responsibility of the content entity
    if (post.status !== PostStatus.Draft) {
      this._logger.assign({ post: { id: post.id, status: post.status } });
      this._logger.debug?.('Post is not in draft state');
      post.draft();
      promises.push(this._postRepository.save(post));
    }
    this._logger.debug?.('Post saved %d', promises.length);

    await Promise.all(promises);

    return new DeltaSaveOutput(post.id);
  }

  private async applyChanges(
    strategy: ContentChangeStrategy,
  ): Promise<string[]> {
    await this._paragraphRepository.applyBulk(strategy.changes());
    return strategy.paragraphs();
  }
}
