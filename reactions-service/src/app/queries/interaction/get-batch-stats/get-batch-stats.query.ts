export class GetBatchStatsQuery {
  constructor(
    public readonly postIds: string[],
    public readonly initiatedBy: string,
  ) {}
}
