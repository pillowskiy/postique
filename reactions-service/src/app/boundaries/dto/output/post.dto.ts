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

export class PostStatisticOutput {
  constructor(
    public readonly postId: string,
    public readonly liked: boolean,
    public readonly saved: boolean,
    public readonly collectionId: string | null,
  ) {}
}

export class GetBatchStatsOutput {
  constructor(public readonly stats: PostStatisticOutput[]) {}
}
