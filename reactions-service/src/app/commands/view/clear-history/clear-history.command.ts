export class ClearHistoryCommand {
  constructor(
    public readonly userId: string,
    public readonly initiatedBy: string,
  ) {}
}
