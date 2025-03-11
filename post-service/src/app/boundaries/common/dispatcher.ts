import { BaseEvent } from '@/domain/events';

export interface IEventDispatcher {
  register(event: BaseEvent<any>): void;
  dispatch(): void;
}
