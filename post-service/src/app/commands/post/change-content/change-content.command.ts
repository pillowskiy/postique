export class ChangePostContentCommand {
  constructor(
    public readonly postId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly content: string,
    public readonly iniatedBy: string,
  ) {}
}
