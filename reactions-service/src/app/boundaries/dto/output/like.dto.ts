export class LikeOutput {
  constructor(
    public readonly userId: string,
    public readonly targetId: string,
    public readonly createdAt: Date,
  ) {}
}

export class ToggleLikeOutput {
  constructor(public readonly isLiked: boolean) {}
}
