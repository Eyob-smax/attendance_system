import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request } from 'express';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable()
export class GeneralInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const time = Date.now();
    const request = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      map((response) => {
        const took = Date.now() - time;
        console.log(`Took ${took}ms`);

        const method = request.method;

        const isWrapped =
          response && typeof response === 'object' && 'data' in response;
        const isCached =
          response && typeof response === 'object' && 'cached' in response;

        const data = isWrapped ? response.data : response;
        const cached = isCached ? response.cached : false;

        if (method === 'GET') {
          return {
            success: true,
            cached,
            data,
            time: `${took}ms`,
          };
        }

        return {
          success: true,
          data,
          time: `${took}ms`,
        };
      }),

      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
}
