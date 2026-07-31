import { Request } from 'express';
import { logger } from '../config/logger';

export type AuthEventType =
  | 'auth.login'
  | 'auth.signup'
  | 'auth.logout'
  | 'auth.refresh'
  | 'auth.tokenExpired'
  | 'auth.invalidToken'
  | 'auth.refreshFailed'
  | 'auth.tokenReuseDetected';

export interface AuthLogContext {
  event: AuthEventType;
  userId?: string;
  endpoint?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  details?: Record<string, any>;
}

/**
 * Helper to emit structured JSON authentication logs
 */
export function logAuthEvent(req: Request, event: AuthEventType, userId?: string, details?: Record<string, any>): void {
  const logContext: AuthLogContext = {
    event,
    userId: userId || (req as any).user?.userId,
    endpoint: req.originalUrl || req.url,
    requestId: req.requestId,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    details,
  };

  if (event === 'auth.tokenReuseDetected') {
    logger.warn(`SECURITY ALERT: ${event}`, logContext);
  } else if (event === 'auth.tokenExpired' || event === 'auth.invalidToken' || event === 'auth.refreshFailed') {
    logger.warn(`Auth Event: ${event}`, logContext);
  } else {
    logger.info(`Auth Event: ${event}`, logContext);
  }
}
