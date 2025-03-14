export class CreatePostCommand {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly content: string,
    public readonly visibility: string,
    public readonly initiatedBy: string,
  ) {}
}
