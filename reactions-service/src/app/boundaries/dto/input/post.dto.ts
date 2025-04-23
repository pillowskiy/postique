export class PostInput {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly coverImage: string | null,
    public readonly visibility: string,
    public readonly status: string,
  ) {}
}

export class GetBatchStatsInput {
  constructor(public readonly postIds: string[]) {}
}
