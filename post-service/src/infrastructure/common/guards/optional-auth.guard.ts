import {
  CanActivate,
  ExecutionContext,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Injectable()
export class OptionalAuthGuard
  extends AuthGuard
  implements OnModuleInit, CanActivate
{
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return super.canActivate(context);
    } catch (err) {
      return true;
    }
  }
}
