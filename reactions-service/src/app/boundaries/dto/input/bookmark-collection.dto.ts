export class CreateBookmarkCollectionInput {
  constructor(
    public readonly userId: string,
    public readonly name: string,
    public readonly description?: string,
  ) {}
}

export class UpdateBookmarkCollectionInput {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly description?: string,
  ) {}
}
