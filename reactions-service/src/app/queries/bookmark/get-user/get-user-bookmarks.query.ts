export class GetUserBookmarksQuery {
  constructor(
    public readonly userId: string,
    public readonly requestedBy: string,
    public readonly cursor?: string,
    public readonly pageSize?: number,
  ) {}
}
