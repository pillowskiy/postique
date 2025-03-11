import { BaseEvent } from '@/domain/common/events';

export interface IEventDispatcher {
  register(event: BaseEvent<any>): void;
  dispatch(): void;
}
