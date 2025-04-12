export class CreateCollectionCommand {
  constructor(
    public readonly name: string,
    public readonly initiatedBy: string,
    public readonly description?: string,
  ) {}
}
