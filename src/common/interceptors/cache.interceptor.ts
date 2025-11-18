import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import type { RedisClientType } from 'redis';
import { CACHE_KEY } from '../decorators/cache.decorator.js';
import { Reflector } from '@nestjs/core';
import { of } from 'rxjs';
import { REDIS_EX_NUM } from '../constants/constants.js';

@Injectable()
export class SmartCacheInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    @Inject('REDIS_CLIENT') private redis: RedisClientType,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const useCache = this.reflector.get<boolean>(
      CACHE_KEY,
      context.getHandler(),
    );
    if (!useCache) return next.handle();

    const request = context.switchToHttp().getRequest();
    const cacheKey = this.buildKey(request);

    const cached = await this.redis.get(cacheKey);
    if (cached) {
      if (typeof cached !== 'string') {
        throw new BadRequestException('The cached data is not a string');
      }
      const parsed = JSON.parse(cached);

      next.handle().subscribe(async (fresh) => {
        await this.redis.setEx(cacheKey, REDIS_EX_NUM, JSON.stringify(fresh));
      });

      return of({
        cached: true,
        data: parsed,
      });
    }

    return next.handle().pipe(
      tap(async (fresh) => {
        await this.redis.setEx(cacheKey, REDIS_EX_NUM, JSON.stringify(fresh));
      }),
    );
  }

  private buildKey(req: any) {
    return `cache:${req.method}:${req.route?.path}:${JSON.stringify(
      req.query,
    )}`;
  }
}
