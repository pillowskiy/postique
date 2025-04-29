export class GetHistoryQuery {
  constructor(
    public readonly userId: string,
    public readonly cursor?: string,
    public readonly pageSize?: number,
  ) {}
}
