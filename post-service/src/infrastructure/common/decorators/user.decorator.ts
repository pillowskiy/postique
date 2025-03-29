import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { InternalException } from '@/app/boundaries/errors';

function getInitiatorFromCtx(ctx: ExecutionContext): string {
  const { userId } = ctx.switchToHttp().getRequest<Record<string, unknown>>();
  if (!userId || typeof userId !== 'string') {
    throw new InternalException(
      'Internal server error occurred',
      new Error(
        'User id is not in request context, make sure to use AuthGuard before calling this function',
      ),
    );
  }
  return userId;
}

export const InitiatedBy = createParamDecorator(
  (_: never, ctx: ExecutionContext): string => {
    return getInitiatorFromCtx(ctx);
  },
);

export const OptionalInitiatedBy = createParamDecorator(
  (_: never, ctx: ExecutionContext): string | undefined => {
    try {
      return getInitiatorFromCtx(ctx);
    } catch {
      return undefined;
    }
  },
);
