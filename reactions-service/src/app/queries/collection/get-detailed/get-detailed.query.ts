export class GetDetailedCollectionQuery {
  constructor(
    public readonly slug: string,
    public readonly requestedBy?: string,
  ) {}
}
