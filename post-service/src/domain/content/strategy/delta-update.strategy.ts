import { BulkOperation, BulkOperationType } from '@/domain/common/bulk';
import { DeltaEntity, DeltaGroup, DeltaType } from '@/domain/content';
import { ParagraphAggregate } from '@/domain/content';

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

  public insertDelta(delta: DeltaEntity): void {
    const paragraph = this._paragraphs[delta.index];
    if (paragraph) {
      // Paragraph at the specified index exist.
      // Fallback to update to maintain consistency and avoid runtime issues.
      return this.updateDelta(delta);
    }

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
    if (delta.index < 0 || delta.index >= this._paragraphs.length) {
      return;
    }

    const paragraph = this._paragraphs[delta.index];
    if (!paragraph) {
      return;
    }
    this._paragraphs.splice(delta.index, 1);
    this._changeList.push(
      new BulkOperation(BulkOperationType.Delete, paragraph),
    );
  }

  public updateDelta(delta: DeltaEntity): void {
    const paragraph = this._paragraphs[delta.index];
    if (!paragraph) {
      // Paragraph at the specified index doesn't exist.
      // Fallback to insert to maintain consistency and avoid runtime issues.
      return this.insertDelta(delta);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    delta.paragraph.id = paragraph;

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
}
