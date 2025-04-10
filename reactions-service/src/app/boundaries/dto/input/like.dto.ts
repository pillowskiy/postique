export class CreateLikeInput {
  constructor(
    public readonly userId: string,
    public readonly targetId: string,
  ) {}
}
