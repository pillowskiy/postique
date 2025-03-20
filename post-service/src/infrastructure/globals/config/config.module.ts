import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Config } from './config.schema';
import { AppConfigService } from './config.service';

@Module({
  imports: [
    NestConfigModule.forRoot<Config>({
      isGlobal: true,
      envFilePath: AppConfigModule.envPath(),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      validate: Config.validate,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {
  static envPath(): string | string[] {
    const env = process.env.NODE_ENV;
    const paths = ['.env'];
    if (env) {
      paths.push(`.env.${env}`);
    }
    return paths;
  }
}
