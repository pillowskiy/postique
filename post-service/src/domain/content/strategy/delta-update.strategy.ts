import { DomainBusinessRuleViolation } from '@/domain/common/error';
import { DeltaEntity, DeltaGroup } from '../delta/delta.entity';
import { ParagraphAggregate } from '../paragraph';
import { DeltaType } from '../delta/delta.interface';

export class ParagraphUpdateNode<T extends 'keep' | 'delete' | 'save'> {
  constructor(
    public readonly strategy: T,
    public readonly target: string,
    public readonly content: T extends 'save' ? ParagraphAggregate<any> : null,
  ) {}

  isSave(): this is ParagraphUpdateNode<'save'> {
    return this.strategy === 'save';
  }

  isDelete(): this is ParagraphUpdateNode<'delete'> {
    return this.strategy === 'delete';
  }

  isKeep(): this is ParagraphUpdateNode<'keep'> {
    return this.strategy === 'keep';
  }
}

export class ContentChangeStrategy {
  private _changeList: ParagraphUpdateNode<any>[];
  private _paragraphs: string[];

  constructor(paragraphs: string[]) {
    this._paragraphs = paragraphs;
    this._changeList = paragraphs.map(
      (p) => new ParagraphUpdateNode('keep', p, null),
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
    this._paragraphs.splice(delta.index, 0, delta.paragraph.name);
    this._changeList.push(
      new ParagraphUpdateNode('save', delta.paragraph.name, delta.paragraph),
    );
  }

  public deleteDelta(delta: DeltaEntity) {
    const paragraph = this._getParagraph(delta.index);
    this._paragraphs.splice(delta.index, 1);
    this._changeList.push(new ParagraphUpdateNode('delete', paragraph, null));
  }

  public updateDelta(delta: DeltaEntity) {
    const _ = this._getParagraph(delta.index);
    this._changeList.push(
      new ParagraphUpdateNode('save', delta.paragraph.name, delta.paragraph),
    );
  }

  public paragraphs(): string[] {
    return this._paragraphs;
  }

  public changes(): ParagraphUpdateNode<any>[] {
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
