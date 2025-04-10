export class CreateViewInput {
  constructor(
    public readonly targetId: string,
    public readonly userId?: string,
    public readonly readPercentage?: number,
    public readonly readingTime?: number,
    public readonly referrer?: string,
    public readonly userAgent?: string,
  ) {}
}
