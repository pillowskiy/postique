import { UpdatePostMetadataInput } from '@/app/boundaries/dto/input';

export class PublishPostCommand {
  constructor(
    public readonly postId: string,
    public readonly meta: UpdatePostMetadataInput,
    public readonly initiatedBy: string,
  ) {}
}
