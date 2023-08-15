import { Request } from 'express';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TRANSFORM_PUBLIC_KEY_METADATA } from 'src/contants/decorator.contants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  accessTokenSecret: string;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {
    this.accessTokenSecret = this.configService.get('SECRET')
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<string[]>(TRANSFORM_PUBLIC_KEY_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.accessTokenSecret,
      });
      console.log('auth.guard.ts', payload)
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // const [type, token] = request.headers.authorization?.split(' ') ?? [];
    // return type === 'Bearer' ? token : undefined;
    return request.headers['user-token'] as string
  }
}