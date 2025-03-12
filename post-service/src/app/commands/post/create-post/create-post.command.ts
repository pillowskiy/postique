export class CreatePostCommand {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly content: string,
    public readonly owner: string,
    public readonly visibility: string,
  ) {}
}
