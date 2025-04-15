export class CreatePostInput {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly visibility: string,
  ) {}
}
