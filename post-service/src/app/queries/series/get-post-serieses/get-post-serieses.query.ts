export class GetPostSeriesesQuery {
  constructor(
    public readonly postId: string,
    public readonly initiatedBy?: string,
  ) {}
}
