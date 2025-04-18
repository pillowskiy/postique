import { CreatePostInput } from '@/app/boundaries/dto/input';

export class CreatePostCommand {
  constructor(
    public readonly data: CreatePostInput,
    public readonly initiatedBy: string,
  ) {}
}
