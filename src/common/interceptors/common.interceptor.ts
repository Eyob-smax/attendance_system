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
      map((data) => {
        console.log(`Took ${Date.now() - time}ms`);
        return request.method === 'GET'
          ? data.cached
            ? { success: true, cached: true, data: data.data }
            : { success: true, cached: false, data: data.data }
          : { success: true, data: data.data || data };
      }),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
}
