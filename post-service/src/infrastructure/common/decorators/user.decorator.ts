import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { InternalException } from '@/app/boundaries/errors';

export const InitiatedBy = createParamDecorator(
  (ctx: ExecutionContext): string => {
    const { user }: { user: { uid: string } } = ctx.switchToHttp().getRequest();
    if (!user.uid || typeof user.uid !== 'string') {
      throw new InternalException(
        'Internal server error occurred',
        new Error(
          'User id is not in request context, make sure to use AuthGuard before calling this function',
        ),
      );
    }
    return user.uid;
  },
);

export const OptionalInitiatedBy = createParamDecorator(
  (ctx: ExecutionContext): string | undefined => {
    const { user }: { user: { uid?: string } } = ctx
      .switchToHttp()
      .getRequest();
    if (!user.uid || typeof user.uid !== 'string') {
      return undefined;
    }
    return user.uid;
  },
);
