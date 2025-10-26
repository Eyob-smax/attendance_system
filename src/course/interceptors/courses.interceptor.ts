// import {
//   CallHandler,
//   ExecutionContext,
//   Inject,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { error } from 'console';
// import { Request } from 'express';
// import type { RedisClientType } from 'redis';
// import { Observable } from 'rxjs';
// @Injectable()
// export class CourseInterceptor implements NestInterceptor {
//   constructor(
//     @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
//   ) {}

//   intercept(
//     context: ExecutionContext,
//     next: CallHandler<any>,
//   ): Observable<any> | Promise<Observable<any>> {
//     const request = context.switchToHttp().getRequest<Request>();

//     const key = `${request.method}:${request.url}`;
//     return new Observable((subscriber) => {
//       this.redis?.get(key).then((cachedData) => {
//         if (cachedData && request.method === 'GET') {
//           subscriber.next({
//             cached: true,
//             data: JSON.parse(cachedData as string),
//           });
//           subscriber.complete();
//         } else {
//           next.handle().subscribe({
//             next: async (data) => {
//               subscriber.next({ cached: false, data });
//               subscriber.complete();
//               await this.redis.setEx(key, 60, JSON.stringify(data));
//             },
//             error: (err) => subscriber.error(err),
//           });
//         }
//       });
//     });
//   }
// }
