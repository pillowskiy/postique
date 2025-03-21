import { Delta } from '@/app/boundaries/dto/input';

export class DeltaSaveCommand {
  constructor(
    public readonly postId: string,
    public readonly deltas: Delta[] = [],
  ) {}
}
