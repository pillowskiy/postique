import { IdentifierDto } from '../common';

export class BookmarkCollectionOutput {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly description?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}

export class CreateBookmarkCollectionOutput extends IdentifierDto {}
