import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { env } from '../env';

// ─────────────────────────────────────────────────────────────────────────────
// Global Error Handler Middleware
// Must be registered last in the middleware chain
// Suppresses stack traces for expected operational & authentication failures (4xx)
// ─────────────────────────────────────────────────────────────────────────────

export function errorHandler(
  error: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const isApiError = error instanceof ApiError;
  const statusCode = isApiError ? (error as ApiError).statusCode : 500;

  // Log level & stack trace policy:
  // Expected operational / auth errors (4xx) -> WARN level without stack traces
  // Server/Unexpected errors (5xx) -> ERROR level with stack trace in development
  if (isApiError && statusCode < 500) {
    logger.warn(`[${req.method} ${req.originalUrl}] ${error.message} (${statusCode})`);
  } else {
    logger.error(`[ErrorHandler] ${error.message}`, {
      url: req.originalUrl,
      method: req.method,
      statusCode,
      stack: env.IS_DEVELOPMENT ? error.stack : undefined,
    });
  }

  // Handle known ApiErrors
  if (isApiError) {
    res.status(statusCode).json(
      ApiResponse.error(error.message, statusCode, (error as ApiError).errors),
    );
    return;
  }

  // Handle Prisma known errors
  if (error.name === 'PrismaClientKnownRequestError') {
    res.status(400).json(ApiResponse.error('Database operation failed', 400));
    return;
  }

  // Fallback: Internal Server Error
  const message = env.IS_PRODUCTION ? 'Internal Server Error' : error.message;
  res.status(500).json(ApiResponse.error(message, 500));
}
