import { env } from '../env';

// ─────────────────────────────────────────────────────────────────────────────
// JWT Configuration Constants
// Implementation will occur in Phase 2 (Authentication Module)
// ─────────────────────────────────────────────────────────────────────────────

export const jwtConfig = {
  access: {
    secret: env.JWT_ACCESS_SECRET,
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  },
  refresh: {
    secret: env.JWT_REFRESH_SECRET,
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
  cookieName: {
    accessToken: 'fitaix_access',
    refreshToken: 'fitaix_refresh',
  },
} as const;

export type JwtConfig = typeof jwtConfig;
