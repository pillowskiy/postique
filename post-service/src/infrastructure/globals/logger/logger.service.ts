import { Logger } from '@/app/boundaries/common';
import { Inject } from '@nestjs/common';
import { Params, PARAMS_PROVIDER_TOKEN, PinoLogger } from 'nestjs-pino';

export class PinoLoggerService extends PinoLogger implements Logger {
  constructor(@Inject(PARAMS_PROVIDER_TOKEN) params: Params) {
    super(params);
  }

  log(message: string, ...optionalParams: any[]): void {
    this.logger.info(message, ...optionalParams);
  }
}
