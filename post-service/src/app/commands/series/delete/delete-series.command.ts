export class DeleteSeriesCommand {
  constructor(
    public readonly seriesId: string,
    public readonly initiatedBy: string,
  ) {}
}
