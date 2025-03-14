export class DeletePostCommand {
  constructor(
    public readonly postId: string,
    public readonly initiatedBy: string,
  ) {}
}
