export class ChangePostVisibilityCommand {
  constructor(
    public readonly postId: string,
    public readonly visibility: string,
    public readonly initiatedBy: string,
  ) {}
}
