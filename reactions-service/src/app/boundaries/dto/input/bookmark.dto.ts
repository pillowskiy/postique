export class CreateBookmarkInput {
  constructor(
    public readonly userId: string,
    public readonly targetId: string,
    public readonly collectionId?: string,
  ) {}
}
