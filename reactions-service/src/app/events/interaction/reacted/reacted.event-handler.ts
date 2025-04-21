import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReactedEvent, ReactionType } from './reacted.event';
import { PostInteractionRepository } from '@/app/boundaries/repository';
import { Inject, Logger } from '@nestjs/common';

@EventsHandler(ReactedEvent)
export class ReactedEventHandler implements IEventHandler<ReactedEvent> {
  private readonly _logger = new Logger(ReactedEventHandler.name);

  @Inject(PostInteractionRepository)
  private readonly _postInteractionRepo: PostInteractionRepository;

  async handle(event: ReactedEvent) {
    try {
      this._logger.debug?.(`Handling ${event.postId}`);
      await this._handleReaction(
        event.reactionType,
        event.postId,
        event.increment,
      );
      this._logger.debug?.(`Handled ${event.postId}`);
    } catch (err) {
      this._logger.error(err);
    }
  }

  private _handleReaction(
    type: ReactionType,
    postId: string,
    increment: boolean,
  ) {
    switch (type) {
      case ReactionType.Like:
        return this._postInteractionRepo.updateLikeCount(postId, increment);
      case ReactionType.Bookmark:
        return this._postInteractionRepo.updateBookmarkCount(postId, increment);
      case ReactionType.Comment:
        return this._postInteractionRepo.updateCommentCount(postId, increment);
      case ReactionType.View:
        return this._postInteractionRepo.updateViewCount(postId);
    }
  }
}
