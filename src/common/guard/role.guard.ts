import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../decorators/role.decorator.js';
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { verify } from '../utils/authUtil.js';
import { ConfigService } from '@nestjs/config';

type UserRole = 'user' | 'admin' | 'super-admin';

interface RolePayload extends JwtPayload {
  role: UserRole;
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly config: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<UserRole[]>(
      Role,
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    const token = request.cookies?.token;
    const secret = this.config.get<string>('JWT_SECRET');

    if (!token) {
      throw new UnauthorizedException('Authentication token not found.');
    }

    let decoded: RolePayload;
    try {
      decoded = verify(token, secret) as RolePayload;
    } catch (e) {
      throw new UnauthorizedException(
        'Invalid or expired authentication token.',
      );
    }

    const userRole = decoded.role;

    if (!userRole) {
      throw new UnauthorizedException(
        'Token is missing user role information.',
      );
    }

    const hasPermission = requiredRoles.includes(userRole);

    if (!hasPermission) {
      throw new ForbiddenException(
        `User role (${userRole}) is not authorized to access this resource.`,
      );
    }

    return true;
  }
}
