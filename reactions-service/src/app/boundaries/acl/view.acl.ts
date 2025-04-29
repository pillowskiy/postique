import { ViewEntity } from '@/domain/view';

export abstract class ViewAccessControlList {
  // TEMP: The entity should serve as the primary source of truth for permission checks
  abstract canClearHistory(
    userId: string,
    history: { userId: string },
  ): Promise<boolean>;
  abstract canRemoveView(userId: string, view: ViewEntity): Promise<boolean>;
}
