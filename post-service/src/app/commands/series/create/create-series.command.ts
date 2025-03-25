import { CreateSeriesInput } from '@/app/boundaries/dto/input';

export class CreateSeriesCommand {
  constructor(
    public readonly series: CreateSeriesInput,
    public readonly initiatedBy: string,
  ) {}
}
