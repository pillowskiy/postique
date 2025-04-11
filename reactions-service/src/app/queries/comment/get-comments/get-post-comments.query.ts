export class GetPostCommentsQuery {
  constructor(
    public readonly postId: string,
    public readonly requestedBy: string,
    public readonly cursor?: string,
    public readonly pageSize?: number,
  ) {}
}
