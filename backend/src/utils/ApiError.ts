// ─────────────────────────────────────────────────────────────────────────────
// API Error Class
// Standardized error format for the FitAI X API
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: ApiErrorDetail[];
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number,
    errors: ApiErrorDetail[] = [],
    isOperational = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  // ── Static Factory Methods ─────────────────────────────────────────────────

  static badRequest(message: string, errors: ApiErrorDetail[] = []): ApiError {
    return new ApiError(message, 400, errors);
  }

  static unauthorized(message = 'Unauthorized'): ApiError {
    return new ApiError(message, 401);
  }

  static forbidden(message = 'Forbidden'): ApiError {
    return new ApiError(message, 403);
  }

  static notFound(message = 'Resource not found'): ApiError {
    return new ApiError(message, 404);
  }

  static conflict(message: string): ApiError {
    return new ApiError(message, 409);
  }

  static validationError(message: string, errors: ApiErrorDetail[] = []): ApiError {
    return new ApiError(message, 422, errors);
  }

  static tooManyRequests(message = 'Too many requests'): ApiError {
    return new ApiError(message, 429);
  }

  static internal(message = 'Internal Server Error'): ApiError {
    return new ApiError(message, 500, [], false);
  }
}
