import { IdentifierDto } from '../common';

export class BookmarkOutput {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly targetId: string,
    public readonly collectionId?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}

export class AddBookmarkOutput extends IdentifierDto {}

export class DeleteBookmarkOutput extends IdentifierDto {}

export class MoveBookmarkOutput extends IdentifierDto {}
