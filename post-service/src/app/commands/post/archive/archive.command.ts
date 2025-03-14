export class ArchivePostCommand {
  constructor(
    public readonly postId: string,
    public readonly initiatedBy: string,
  ) {}
}
