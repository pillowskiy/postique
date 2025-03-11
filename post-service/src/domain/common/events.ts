export enum EventType {}

export abstract class BaseEvent<T extends any = any> {
  public abstract eventType: EventType;

  constructor(public readonly data: T) {}
}
