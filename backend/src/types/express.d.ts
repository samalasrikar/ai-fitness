import { Request } from 'express';

// ─────────────────────────────────────────────────────────────────────────────
// Custom Express Types & Declarations
// ─────────────────────────────────────────────────────────────────────────────

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'COACH';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
