import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { env } from '../env';

// ─────────────────────────────────────────────────────────────────────────────
// Global Error Handler Middleware
// Must be registered last in the middleware chain
// ─────────────────────────────────────────────────────────────────────────────

export function errorHandler(
  error: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Log the error
  logger.error(`[ErrorHandler] ${error.message}`, {
    url: req.originalUrl,
    method: req.method,
    stack: env.IS_DEVELOPMENT ? error.stack : undefined,
  });

  // Handle known ApiErrors
  if (error instanceof ApiError) {
    res.status(error.statusCode).json(
      ApiResponse.error(error.message, error.statusCode, error.errors),
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
