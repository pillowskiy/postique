export class StatsDto {
  constructor(
    public readonly likesCount: number,
    public readonly bookmarksCount: number,
    public readonly commentsCount: number,
    public readonly viewsCount: number,
  ) {}
}

export class FindBatchOutput {
  constructor(public readonly stats: StatsDto[]) {}
}
