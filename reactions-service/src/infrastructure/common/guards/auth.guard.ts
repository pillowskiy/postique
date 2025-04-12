import { AppConfigService } from '@/infrastructure/globals/config';
import { JWTService, KeyLike } from '@/infrastructure/lib/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { readFile } from 'fs/promises';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements OnModuleInit, CanActivate {
  private _cert: KeyLike;
  private readonly _alg: string;
  private readonly _crv: string;

  constructor(private readonly _config: AppConfigService) {
    this._alg = this._config.get('JWT_ALG');
    this._crv = this._config.get('JWT_CRV');
  }

  async onModuleInit() {
    const secretPath = this._config.get('JWT_KEY_PATH');
    const secretData = await readFile(secretPath);
    this._cert = await JWTService.importJWK(secretData, this._crv);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this._extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const payload = await JWTService.verify<Record<string, unknown>>(
        token,
        this._cert,
        this._alg,
      );

      if (!('uid' in payload) || typeof payload.uid !== 'string') {
        throw new UnauthorizedException('Invalid token payload');
      }

      (request as Record<string, any>).userId = payload.uid;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private _extractToken(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  }
}
