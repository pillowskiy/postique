import { IdentifierDto } from '../common';

export class LikeOutput {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly targetId: string,
    public readonly createdAt: Date,
  ) {}
}

export class CreateLikeOutput extends IdentifierDto {}
