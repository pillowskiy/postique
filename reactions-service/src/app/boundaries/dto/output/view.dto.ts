export class ViewOutput {
  constructor(
    public readonly userId: string | null,
    public readonly targetId: string,
    public readonly readPercentage: number,
    public readonly readingTime: number,
    public readonly createdAt: Date,
    public readonly referrer?: string,
    public readonly userAgent?: string,
  ) {}
}

export class RegisterViewOutput {}

export class ClearHistoryOutput {}

export class RemoveViewOutput {}
