export enum ReactionType {
  Like = 'LIKE',
  Bookmark = 'BOOKMARK',
  Comment = 'COMMENT',
  View = 'VIEW',
}

export class ReactedEvent {
  constructor(
    public readonly postId: string,
    public readonly reactionType: ReactionType,
    public readonly increment: boolean,
  ) {}
}
