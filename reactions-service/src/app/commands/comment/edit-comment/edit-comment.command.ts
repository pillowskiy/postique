export class EditCommentCommand {
  constructor(
    public readonly commentId: string,
    public readonly content: string,
    public readonly initiatedBy: string,
  ) {}
}
