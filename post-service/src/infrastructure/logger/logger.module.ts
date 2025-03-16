import { Logger } from '@/app/boundaries/common';
import { Global, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { PinoLoggerService } from './logger.service';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRoot({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      pinoHttp: [
        {
          redact: ['req.headers.authorization'],
          level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
          transport:
            process.env.NODE_ENV !== 'production'
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                  },
                }
              : undefined,
        },
      ],
    }),
  ],
  providers: [
    {
      provide: Logger,
      useClass: PinoLoggerService,
    },
  ],
  exports: [Logger],
})
export class LoggerModule {}
