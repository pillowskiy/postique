export enum ReactionType {
  Like = 'like',
  Bookmark = 'bookmark',
  Comment = 'comment',
  View = 'view',
  Report = 'report',
}

export abstract class ReactionEntity {
  protected constructor(
    public readonly userId: string,
    public readonly targetId: string,
    protected _createdAt: Date,
    protected _updatedAt: Date,
  ) {}

  abstract type(): ReactionType;

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  isFresh(): boolean {
    const oneDay = 24 * 60 * 60 * 1000;
    return Date.now() - this.createdAt.getTime() < oneDay;
  }
}
