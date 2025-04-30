export class DeleteBookmarkCommand {
  constructor(
    public readonly targetId: string,
    public readonly collectionId: string | null,
    public readonly initiatedBy: string,
  ) {}
}
