import { ViewAccessControlList } from '@/app/boundaries/acl';
import { ViewEntity } from '@/domain/view';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ViewAccessControlListProvider extends ViewAccessControlList {
  async canClearHistory(
    userId: string,
    hst: { userId: string },
  ): Promise<boolean> {
    return Promise.resolve(userId === hst.userId);
  }

  async canRemoveView(userId: string, view: ViewEntity): Promise<boolean> {
    return Promise.resolve(view.userId === userId);
  }
}
