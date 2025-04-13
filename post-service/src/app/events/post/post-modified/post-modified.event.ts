export class PostModifiedEvent {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly coverImage: string | null,
    public readonly visibility: string,
    public readonly status: string,
  ) {}
}
