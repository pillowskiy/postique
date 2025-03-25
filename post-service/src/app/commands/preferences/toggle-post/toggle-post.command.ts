export class TogglePostCommand {
  constructor(
    public readonly postId: string,
    public readonly initiatedBy: string,
  ) {}
}
