import { PostSeriesEntity } from '@/domain/series';
import { AccessControlListResult } from './common';

export abstract class SeriesAccessControlList {
  abstract canCreate(
    userId: string,
    series: PostSeriesEntity,
  ): AccessControlListResult;
  abstract canModify(
    userId: string,
    series: PostSeriesEntity,
  ): AccessControlListResult;
  abstract canDelete(
    userId: string,
    series: PostSeriesEntity,
  ): AccessControlListResult;
}
