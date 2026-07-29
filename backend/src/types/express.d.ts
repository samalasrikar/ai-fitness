// ─────────────────────────────────────────────────────────────────────────────
// Custom Express Types & Declarations
// ─────────────────────────────────────────────────────────────────────────────

export interface AuthenticatedUser {
  id: string;
  userId: string;
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
