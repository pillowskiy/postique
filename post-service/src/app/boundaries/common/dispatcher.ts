import { BaseEvent } from '@/domain/common/events';

export abstract class EventDispatcher {
  abstract register(event: BaseEvent<any>): void;
  abstract dispatch(): void;
}
