import { IncomingEntity } from '@/domain/common/entity';
import { IParagraph } from '../paragraph/content-paragraph.interface';

export enum DeltaType {
  Insert,
  Delete,
  Update,
}

export type IncomingDelta = IncomingEntity<IDelta, {}>;

export interface IDelta {
  type: DeltaType;
  index: number;
  paragraph: IParagraph;
}
