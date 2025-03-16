import { Logger } from '@/app/boundaries/common';
import { ApplicationException, ErrorCode } from '@/app/boundaries/errors';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(ApplicationException)
export class ApplicationExceptionFilter implements ExceptionFilter {
  codes = {
    [ErrorCode.Internal]: 500,
    [ErrorCode.NotFound]: 404,
    [ErrorCode.Forbidden]: 403,
    [ErrorCode.Conflict]: 409,
    [ErrorCode.Validation]: 400,
    [ErrorCode.Unprocessable]: 422,
  };

  constructor(private readonly _logger: Logger) {}

  catch(exception: ApplicationException, host: ArgumentsHost) {
    if (exception.isCritical()) {
      this._logger.error('Critical error occurred', {
        message: exception.message,
        parent: {
          message: exception.parent.message,
          stack: exception.parent.stack,
        },
      });
    }

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<FastifyReply>();
    const statusCode = this.codes[exception.code];
    const responseBody = {
      statusCode,
      message: exception.message,
      code: exception.code,
      details: exception.details,
    };

    res.status(statusCode).send(responseBody);
  }
}
