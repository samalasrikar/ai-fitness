import { Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { AuthenticatedRequest, TokenPayload } from './auth.types';
import { ApiError } from '../../utils/ApiError';
import { env } from '../../env';
import { logger } from '../../config/logger';

// ─────────────────────────────────────────────────────────────────────────────
// Authentication Middleware
// Verifies Bearer JWT token from Authorization header or cookies
// Differentiates expired, invalid, malformed tokens vs unexpected exceptions
// ─────────────────────────────────────────────────────────────────────────────

export function authenticateToken(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    logger.warn(`Authentication token missing [${req.method} ${req.originalUrl}]`);
    throw ApiError.unauthorized('Authentication token is missing');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET as Secret) as TokenPayload;
    req.user = decoded;
    next();
  } catch (err: any) {
    if (err instanceof jwt.TokenExpiredError) {
      logger.warn(`Authentication token expired [${req.method} ${req.originalUrl}]`);
      throw ApiError.unauthorized('Authentication token has expired');
    }
    if (err instanceof jwt.JsonWebTokenError) {
      logger.warn(`Invalid authentication token: ${err.message} [${req.method} ${req.originalUrl}]`);
      throw ApiError.unauthorized('Invalid authentication token');
    }
    if (err instanceof jwt.NotBeforeError) {
      logger.warn(`Authentication token not active yet [${req.method} ${req.originalUrl}]`);
      throw ApiError.unauthorized('Authentication token not active');
    }
    logger.error('Unexpected exception during token verification', { error: err.message });
    throw ApiError.internal('Authentication error');
  }
}

export const authenticate = authenticateToken;
