import { IdentifierDto } from '../common';
import { UserOutput } from './user.dto';

export class BookmarkCollectionOutput {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}

export class DetailedBookmarkCollectionOutput
  implements BookmarkCollectionOutput
{
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly bookmarksCount: number = 0,
    public readonly author?: Readonly<UserOutput>,
  ) {}
}

export class CreateBookmarkCollectionOutput extends IdentifierDto {}
