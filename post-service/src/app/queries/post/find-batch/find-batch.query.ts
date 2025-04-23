export class FindBatchQuery {
  constructor(
    public readonly ids: string[],
    public readonly initiatedBy: string | null,
  ) {}
}
