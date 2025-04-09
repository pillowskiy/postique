import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config.schema';

@Injectable()
export class AppConfigService {
  constructor(private readonly _service: ConfigService) {}

  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this._service.getOrThrow(key);
  }
}
