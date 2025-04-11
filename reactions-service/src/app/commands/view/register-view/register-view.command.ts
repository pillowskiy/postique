export class RegisterViewCommand {
  constructor(
    public readonly targetId: string,
    public readonly initiatedBy: string | null,
    public readonly readPercentage: number = 0,
    public readonly readingTime: number = 0,
    public readonly referrer?: string,
    public readonly userAgent?: string,
  ) {}
}
