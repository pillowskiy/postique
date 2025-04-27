import { IdentifierDto } from '../common';
import { UserOutput } from './user.dto';

export class CommentOutput {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly postId: string,
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly parentId?: string,
  ) {}
}

export class DetailedCommentOutput implements CommentOutput {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly postId: string,
    public readonly content: string,
    public readonly author: UserOutput,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly repliesCount: number,
    public readonly parentId?: string,
  ) {}
}

export class CreateCommentOutput extends IdentifierDto {}
export class EditCommentOutput {
  constructor(
    public readonly id: string,
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
export class DeleteCommentOutput extends IdentifierDto {}
