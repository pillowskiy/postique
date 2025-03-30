export class CreateSeriesInput {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly posts: string[],
  ) {}
}

export class UpdateSeriesInput {
  public readonly title?: string;
  public readonly description?: string;
}
