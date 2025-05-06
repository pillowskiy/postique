export class GetCollectionBookmarksQuery {
  constructor(
    public readonly collectionId: string,
    public readonly requestedBy?: string,
    public readonly cursor?: string,
    public readonly pageSize?: number,
  ) {}
}
