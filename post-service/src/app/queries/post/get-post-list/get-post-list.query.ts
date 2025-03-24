export class GetPostListQuery {
  constructor(
    public readonly userId: string,
    public readonly take: number,
    public readonly cursor?: string,
  ) {}
}
