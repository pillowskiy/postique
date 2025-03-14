export class PublishPostCommand {
  constructor(
    public readonly postId: string,
    public readonly initiatedBy: string,
  ) {}
}
