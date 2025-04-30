import { IdentifierDto } from '../common';
import { PostOutput } from './post.dto';

export class BookmarkOutput {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly targetId: string,
    public readonly collectionId: string | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}

export class DetailedBookmarkOutput implements BookmarkOutput {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly targetId: string,
    public readonly post: PostOutput,
    public readonly collectionId: string | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}

export class AddBookmarkOutput extends IdentifierDto {}

export class DeleteBookmarkOutput extends IdentifierDto {}

export class MoveBookmarkOutput extends IdentifierDto {}
