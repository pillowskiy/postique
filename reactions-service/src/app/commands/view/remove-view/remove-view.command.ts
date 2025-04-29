export class RemoveViewCommand {
  constructor(
    public readonly postId: string,
    public readonly initiatedBy: string,
  ) {}
}
