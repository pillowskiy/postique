import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from './config.schema';

@Injectable()
export class AppConfigService {
  constructor(private readonly _service: ConfigService) {}

  get<K extends keyof Config>(key: K): Config[K] {
    return this._service.getOrThrow(key);
  }
}
