export class AddBookmarkCommand {
  constructor(
    public readonly targetId: string,
    public readonly initiatedBy: string,
    public readonly collectionId?: string,
  ) {}
}
