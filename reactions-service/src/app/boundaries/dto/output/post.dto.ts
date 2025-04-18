import { IdentifierDto } from '../common';

export class PostOutput {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly coverImage: string | null,
  ) {}
}

export class CreatePostOutput extends IdentifierDto {}
export class EditPostOutput extends IdentifierDto {}
