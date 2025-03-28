export class GetAuthorBlacklistQuery {
  constructor(
    public readonly userId: string,
    public readonly take: number,
    public readonly skip: number = 0,
  ) {}
}
