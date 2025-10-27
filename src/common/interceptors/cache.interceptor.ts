import {
  CallHandler,
  ExecutionContext,
  Inject,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import type { RedisClientType } from 'redis';
import { Observable } from 'rxjs';
import { REDIS_EX_NUM } from '../constants/constants.js';

export class CommonInterceptor implements NestInterceptor {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
  ) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const key = `${request.method}:${request.url}`;

    return new Observable((subscriber) => {
      this.redis.get(key).then((cachedData) => {
        if (cachedData && request.method === 'GET') {
          subscriber.next({
            cached: true,
            data: JSON.parse(cachedData as string),
          });
          subscriber.complete();
        } else {
          next.handle().subscribe({
            next: async (data) => {
              subscriber.next({ cached: false, data });
              subscriber.complete();
              await this.redis.setEx(key, REDIS_EX_NUM, JSON.stringify(data));
            },
            error: (err) => subscriber.error(err),
          });
        }
      });
    });
  }
}
