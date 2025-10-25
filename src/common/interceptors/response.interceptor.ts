import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseMeta {
  total?: number;
  page?: number;
  perPage?: number;
  [key: string]: unknown;
}

export interface ControllerResponse<T = unknown> {
  data?: T;
  message?: string;
  errors?: unknown;
  meta?: ResponseMeta;
}

export interface ResponseFormat<T = unknown> {
  success: boolean;
  timestamp: string;
  data?: T;
  message?: string;
  errors?: unknown;
  meta?: ResponseMeta;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<ControllerResponse<T> | T>,
  ): Observable<ResponseFormat<T>> {
    return next.handle().pipe(
      map((res: ControllerResponse<T> | T) => {
        let data: T | undefined;
        let message: string | undefined;
        let errors: unknown;
        let meta: ResponseMeta | undefined;

        if (res && typeof res === 'object' && 'data' in res) {
          const controllerRes = res as ControllerResponse<T>;
          data = controllerRes.data;
          message = controllerRes.message;
          errors = controllerRes.errors;
          meta = controllerRes.meta;
        } else {
          data = res as T;
        }

        return {
          success: !errors,
          timestamp: new Date().toISOString(),
          data,
          message,
          errors,
          meta,
        } as ResponseFormat<T>;
      }),
    );
  }
}
