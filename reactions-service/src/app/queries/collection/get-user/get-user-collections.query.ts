export class GetUserCollectionsQuery {
  constructor(
    public readonly userId: string,
    public readonly requestedBy?: string,
  ) {}
}
