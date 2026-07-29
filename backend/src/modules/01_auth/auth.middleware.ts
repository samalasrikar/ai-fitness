import { Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { AuthenticatedRequest, TokenPayload } from './auth.types';
import { ApiError } from '../../utils/ApiError';
import { env } from '../../env';

// ─────────────────────────────────────────────────────────────────────────────
// Authentication Middleware
// Verifies Bearer JWT token from Authorization header or cookies
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
    throw ApiError.unauthorized('Authentication token is missing');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET as Secret) as TokenPayload;
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw ApiError.unauthorized('Authentication token has expired');
    }
    throw ApiError.unauthorized('Invalid authentication token');
  }
}
