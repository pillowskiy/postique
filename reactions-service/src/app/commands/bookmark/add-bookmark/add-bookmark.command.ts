export class AddBookmarkCommand {
  constructor(
    public readonly targetId: string,
    public readonly collectionId: string | null,
    public readonly initiatedBy: string,
  ) {}
}
