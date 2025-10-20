import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { verify } from '../utils/authUtil.js';
import { JwtPayload } from 'jsonwebtoken';

interface AuthUser {
  id: number;
  username: string;
}

interface AuthenticatedRequest extends Request {
  user?: AuthUser | JwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const token = request.cookies.token;
    const secret = this.config.get<string>('JWT_SECRET');

    if (!token) {
      throw new UnauthorizedException('Authentication token not found.');
    }

    try {
      const decoded = verify(token, secret);

      if (!decoded) {
        throw new UnauthorizedException('Session invalid, Unauthorized');
      }

      console.log(decoded);

      request.user = decoded as AuthUser;

      return true;
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid or expired authentication token.',
      );
    }
  }
}
