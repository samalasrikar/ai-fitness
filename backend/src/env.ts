import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// ─────────────────────────────────────────────────────────────────────────────
// Environment variable type-safe accessor
// ─────────────────────────────────────────────────────────────────────────────

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`[env] Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

// ─────────────────────────────────────────────────────────────────────────────
// Validated environment configuration
// ─────────────────────────────────────────────────────────────────────────────

export const env = {
  // Server
  NODE_ENV: optionalEnv('NODE_ENV', 'development'),
  PORT: parseInt(optionalEnv('PORT', '5000'), 10),
  API_PREFIX: optionalEnv('API_PREFIX', '/api/v1'),
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_TEST: process.env.NODE_ENV === 'test',

  // Database (PostgreSQL via Prisma)
  DATABASE_URL: optionalEnv('DATABASE_URL', ''),

  // Redis
  REDIS_HOST: optionalEnv('REDIS_HOST', 'localhost'),
  REDIS_PORT: parseInt(optionalEnv('REDIS_PORT', '6379'), 10),
  REDIS_PASSWORD: optionalEnv('REDIS_PASSWORD', ''),
  REDIS_URL: optionalEnv('REDIS_URL', 'redis://localhost:6379'),

  // JWT
  JWT_ACCESS_SECRET: optionalEnv('JWT_ACCESS_SECRET', 'change-me-access'),
  JWT_REFRESH_SECRET: optionalEnv('JWT_REFRESH_SECRET', 'change-me-refresh'),
  JWT_ACCESS_EXPIRES_IN: optionalEnv('JWT_ACCESS_EXPIRES_IN', '15m'),
  JWT_REFRESH_EXPIRES_IN: optionalEnv('JWT_REFRESH_EXPIRES_IN', '7d'),

  // CORS
  CORS_ORIGIN: optionalEnv('CORS_ORIGIN', 'http://localhost:5173'),
  CORS_CREDENTIALS: optionalEnv('CORS_CREDENTIALS', 'true') === 'true',

  // Cookie
  COOKIE_SECRET: optionalEnv('COOKIE_SECRET', 'change-me-cookie'),

  // Logging
  LOG_LEVEL: optionalEnv('LOG_LEVEL', 'debug'),
  LOG_FILE_PATH: optionalEnv('LOG_FILE_PATH', './logs'),

  // Queue
  QUEUE_REDIS_HOST: optionalEnv('QUEUE_REDIS_HOST', 'localhost'),
  QUEUE_REDIS_PORT: parseInt(optionalEnv('QUEUE_REDIS_PORT', '6379'), 10),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(optionalEnv('RATE_LIMIT_WINDOW_MS', '900000'), 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(optionalEnv('RATE_LIMIT_MAX_REQUESTS', '100'), 10),
} as const;

export type Env = typeof env;
