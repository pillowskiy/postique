export class GetDetailedSeriesQuery {
  constructor(
    public readonly slug: string,
    public readonly initiatedBy?: string,
  ) {}
}
