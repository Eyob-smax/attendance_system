import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { verify } from '../utils/authUtil.js';
import { JwtPayload } from 'jsonwebtoken';

interface AuthUser extends JwtPayload {
  id: number;
  username: string;
  role: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.token;

    if (!token)
      throw new UnauthorizedException('Authentication token not found.');

    const secret = this.config.get<string>('JWT_SECRET');
    if (!secret) throw new UnauthorizedException('JWT secret not configured.');

    try {
      const decoded = verify(token, secret) as AuthUser;

      if (!decoded || !decoded.id) {
        throw new UnauthorizedException('Invalid authentication token.');
      }

      request.user = decoded;
      return true;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('ACCESS_TOKEN_EXPIRED');
      }
      throw new UnauthorizedException(
        'Invalid or expired authentication token.',
      );
    }
  }
}
