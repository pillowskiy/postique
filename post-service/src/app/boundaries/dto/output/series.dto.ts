export class IdentifierHolderOutput {
  constructor(public readonly identifier: string) {}
}

export class CreateSeriesOutput extends IdentifierHolderOutput {}

export class DeleteSeriesOutput extends IdentifierHolderOutput {}

export class UpdateSeriesOutput extends IdentifierHolderOutput {}
