import { DomainBusinessRuleViolation } from './error';

export enum BulkOperationType {
  Keep,
  Insert,
  Save,
  Delete,
}

type WithBodyOperationType = BulkOperationType.Save | BulkOperationType.Insert;

export class BulkOperation<
  T extends BulkOperationType = BulkOperationType,
  E = any,
> {
  public readonly type: T;
  public readonly target: string;
  public readonly content: T extends WithBodyOperationType ? E : null;

  constructor(
    type: Exclude<BulkOperationType, WithBodyOperationType>,
    target: string,
  );
  constructor(type: WithBodyOperationType, target: string, content: E);
  constructor(type: T, target: string, content?: E) {
    this.type = type;
    this.target = target;
    this.content = this._contentFromIncoming(content);
  }

  private _contentFromIncoming(
    incoming?: E | null,
  ): T extends WithBodyOperationType ? E : null {
    // TEMP: Dangerous casting
    type RT = T extends WithBodyOperationType ? E : null;

    if (typeof this.type !== 'number') {
      throw new Error('Bulk operation type is not set, this should not happen');
    }

    const shouldHaveContent = this._shouldHaveContent();
    if (!shouldHaveContent) {
      return null as RT;
    }

    if (shouldHaveContent && !incoming) {
      throw new DomainBusinessRuleViolation(
        `The content of the operation is required for ${this.type} operation`,
      );
    }

    return incoming as RT;
  }

  private _shouldHaveContent(): this is BulkOperation<
    WithBodyOperationType,
    E
  > {
    return this.isSave() || this.isInsert();
  }

  isInsert(): this is BulkOperation<BulkOperationType.Insert, E> {
    return this.type === BulkOperationType.Insert;
  }

  isSave(): this is BulkOperation<BulkOperationType.Save, E> {
    return this.type === BulkOperationType.Save;
  }

  isDelete(): this is BulkOperation<BulkOperationType.Delete, E> {
    return this.type === BulkOperationType.Delete;
  }

  isKeep(): this is BulkOperation<BulkOperationType.Keep, E> {
    return this.type === BulkOperationType.Keep;
  }
}
