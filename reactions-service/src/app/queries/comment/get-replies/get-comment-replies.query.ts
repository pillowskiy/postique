export class GetCommentRepliesQuery {
  constructor(
    public readonly commentId: string,
    public readonly requestedBy: string,
    public readonly cursor?: string,
    public readonly pageSize?: number,
  ) {}
}
