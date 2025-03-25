import { UpdateSeriesInput } from '@/app/boundaries/dto/input';

export class UpdateSeriesCommand {
  constructor(
    public readonly seriesId: string,
    public readonly series: UpdateSeriesInput,
    public readonly initiatedBy: string,
  ) {}
}
