export class CreateViewInput {
  constructor(
    public readonly readPercentage?: number,
    public readonly readingTime?: number,
    public readonly referrer?: string,
    public readonly userAgent?: string,
  ) {}
}
