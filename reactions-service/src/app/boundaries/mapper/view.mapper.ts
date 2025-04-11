import { ViewEntity } from '@/domain/view/view.entity';
import { ViewOutput } from '../dto/output';

export class ViewMapper {
  static toDto(view: ViewEntity): ViewOutput {
    return new ViewOutput(
      view.isAnonymous() ? null : view.userId,
      view.targetId,
      view.readPercentage,
      view.readingTime,
      view.createdAt,
      view.referrer,
      view.userAgent,
    );
  }
}
