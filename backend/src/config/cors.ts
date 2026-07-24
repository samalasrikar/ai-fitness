import { CorsOptions } from 'cors';
import { env } from '../env';

// ─────────────────────────────────────────────────────────────────────────────
// CORS Configuration
// ─────────────────────────────────────────────────────────────────────────────

const allowedOrigins: string[] = env.CORS_ORIGIN.split(',').map((o) => o.trim());

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin) || env.IS_DEVELOPMENT) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin '${origin}' not allowed`));
    }
  },
  credentials: env.CORS_CREDENTIALS,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Per-Page'],
  maxAge: 86400, // 24 hours preflight cache
};
