import { EntityFactory } from '@/domain/common/entity';
import { ParagraphAggregate } from '../paragraph';
import { DeltaType, IDelta, IncomingDelta } from './delta.interface';
import { DeltaSchema } from './delta.schema';

export class DeltaGroup {
  static create(deltas: IncomingDelta[]): DeltaGroup {
    const validDeltas = deltas.map((d) => DeltaEntity.create(d));
    return new DeltaGroup(validDeltas);
  }
  public readonly deltas: DeltaEntity[];

  constructor(deltas: DeltaEntity[]) {
    this.deltas = deltas;
  }
}

export class DeltaEntity implements IDelta {
  static create(delta: IncomingDelta): DeltaEntity {
    console.log(delta);
    const validDelta = EntityFactory.create(DeltaSchema, delta);
    return new DeltaEntity(validDelta);
  }

  public readonly type: DeltaType;
  public readonly index: number;
  public readonly paragraph: ParagraphAggregate;

  constructor(delta: IDelta) {
    this.type = delta.type;
    this.index = delta.index;
    this.paragraph = ParagraphAggregate.create(delta.paragraph);
  }
}
