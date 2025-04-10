export class CreateCommentInput {
  constructor(
    public readonly userId: string,
    public readonly postId: string,
    public readonly content: string,
    public readonly parentId?: string,
  ) {}
}

export class UpdateCommentInput {
  constructor(
    public readonly id: string,
    public readonly content: string,
  ) {}
}
