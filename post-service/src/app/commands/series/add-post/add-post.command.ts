export class AddSeriesPostCommand {
  constructor(
    public readonly seriesId: string,
    public readonly postId: string,
    public readonly initiatedBy: string,
  ) {}
}
