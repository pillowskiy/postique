import { BulkOperation, BulkOperationType } from '@/domain/common/bulk';
import { DomainBusinessRuleViolation } from '@/domain/common/error';
import { DeltaEntity, DeltaGroup } from '../delta/delta.entity';
import { DeltaType } from '../delta/delta.interface';
import { ParagraphAggregate } from '../paragraph';

export class ContentChangeStrategy {
  private _changeList: BulkOperation<BulkOperationType, ParagraphAggregate>[];
  private _paragraphs: string[];

  constructor(paragraphs: string[]) {
    this._paragraphs = paragraphs;
    this._changeList = paragraphs.map(
      (p) => new BulkOperation(BulkOperationType.Keep, p),
    );
  }

  public applyDeltaGroup(group: DeltaGroup) {
    group.deltas.forEach((delta) => {
      this.applyDelta(delta);
    });
  }

  public applyDelta(delta: DeltaEntity) {
    const deltaType = delta.type;
    switch (deltaType) {
      case DeltaType.Insert:
        return this.insertDelta(delta);
      case DeltaType.Delete:
        return this.deleteDelta(delta);
      case DeltaType.Update:
        return this.updateDelta(delta);
    }
  }

  public insertDelta(delta: DeltaEntity) {
    this._paragraphs.splice(delta.index, 0, delta.paragraph.id);
    this._changeList.push(
      new BulkOperation(
        BulkOperationType.Insert,
        delta.paragraph.id,
        delta.paragraph,
      ),
    );
  }

  public deleteDelta(delta: DeltaEntity) {
    const paragraph = this._getParagraph(delta.index);
    this._paragraphs.splice(delta.index, 1);
    this._changeList.push(
      new BulkOperation(BulkOperationType.Delete, paragraph),
    );
  }

  public updateDelta(delta: DeltaEntity) {
    const _ = this._getParagraph(delta.index);
    this._changeList.push(
      new BulkOperation(
        BulkOperationType.Save,
        delta.paragraph.id,
        delta.paragraph,
      ),
    );
  }

  public paragraphs(): string[] {
    return this._paragraphs;
  }

  public changes(): BulkOperation<any, ParagraphAggregate>[] {
    return this._changeList;
  }

  private _getParagraph(index: number): string {
    const paragraph = this._paragraphs[index];
    if (!paragraph) {
      throw new DomainBusinessRuleViolation(
        `Paragraph with position ${index} does not exist`,
      );
    }
    return paragraph;
  }
}
