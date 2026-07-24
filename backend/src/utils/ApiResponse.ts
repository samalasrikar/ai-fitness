import { ApiErrorDetail } from './ApiError';

// ─────────────────────────────────────────────────────────────────────────────
// API Response Shape
// Standardized response envelope for all FitAI X API responses
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiResponseShape<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  errors?: ApiErrorDetail[];
  meta?: ResponseMeta;
  timestamp: string;
}

export interface ResponseMeta {
  page?: number;
  perPage?: number;
  total?: number;
  totalPages?: number;
}

export class ApiResponse {
  static success<T>(
    message: string,
    data?: T,
    statusCode = 200,
    meta?: ResponseMeta,
  ): ApiResponseShape<T> {
    return {
      success: true,
      statusCode,
      message,
      data,
      meta,
      timestamp: new Date().toISOString(),
    };
  }

  static created<T>(message: string, data?: T): ApiResponseShape<T> {
    return ApiResponse.success(message, data, 201);
  }

  static error(
    message: string,
    statusCode = 500,
    errors: ApiErrorDetail[] = [],
  ): ApiResponseShape {
    return {
      success: false,
      statusCode,
      message,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    };
  }

  static paginated<T>(
    message: string,
    data: T[],
    meta: ResponseMeta,
  ): ApiResponseShape<T[]> {
    return {
      success: true,
      statusCode: 200,
      message,
      data,
      meta,
      timestamp: new Date().toISOString(),
    };
  }
}
