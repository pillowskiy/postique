export class DeleteBookmarkCommand {
  constructor(
    public readonly targetId: string,
    public readonly initiatedBy: string,
  ) {}
}
