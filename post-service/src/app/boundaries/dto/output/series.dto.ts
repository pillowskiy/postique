export class IdentifierHolderOutput {
  constructor(public readonly identifier: string) {}
}

export class CreateSeriesOutput extends IdentifierHolderOutput {}

export class DeleteSeriesOutput extends IdentifierHolderOutput {}

export class UpdateSeriesOutput extends IdentifierHolderOutput {}

export class Series {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly slug: string,
    public readonly owner: string,
    public readonly visibility: string,
    public readonly description: string,
    public readonly posts: Readonly<string[]>,
  ) {}
}
