export class GetPostListQuery {
  constructor(
    public readonly take: number,
    public readonly cursor?: string,
    public readonly authorId?: string,
    public readonly initiatedBy?: string,
  ) {}
}
