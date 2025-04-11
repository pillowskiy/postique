export class DeleteCommentCommand {
  constructor(
    public readonly commentId: string,
    public readonly initiatedBy: string,
  ) {}
}
