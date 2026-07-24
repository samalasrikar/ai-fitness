import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError';

// ─────────────────────────────────────────────────────────────────────────────
// Express Validator Result Handler
// Use after a chain of express-validator check() calls
// ─────────────────────────────────────────────────────────────────────────────

export function validate(req: Request, _res: Response, next: NextFunction): void {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.type === 'field' ? err.path : undefined,
      message: err.msg,
    }));

    next(ApiError.validationError('Validation failed', formattedErrors));
    return;
  }

  next();
}
