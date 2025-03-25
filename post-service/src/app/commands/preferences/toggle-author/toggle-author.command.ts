export class ToggleAuthorCommand {
  constructor(
    public readonly authorId: string,
    public readonly initiatedBy: string,
  ) {}
}
