import { IdentifierDto } from '../common';

export class ViewOutput {
  constructor(
    public readonly id: string,
    public readonly userId: string | null,
    public readonly targetId: string,
    public readonly readPercentage: number,
    public readonly readingTime: number,
    public readonly createdAt: Date,
    public readonly referrer?: string,
    public readonly userAgent?: string,
  ) {}
}

export class CreateViewOutput extends IdentifierDto {}
