/**
 * Centralized Environment Variables Validation Module
 * Validates required environment variables at server startup.
 * Throws explicit error if any required environment variable is missing.
 */

const REQUIRED_ENV_VARS = [
  'NODE_ENV',
  'PORT',
  'API_PREFIX',
  'DATABASE_URL',
  'REDIS_HOST',
  'REDIS_PORT',
  'REDIS_URL',
  'QUEUE_REDIS_HOST',
  'QUEUE_REDIS_PORT',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_ACCESS_EXPIRES_IN',
  'JWT_REFRESH_EXPIRES_IN',
  'COOKIE_SECRET',
  'CORS_ORIGIN',
  'CORS_CREDENTIALS',
  'LOG_LEVEL',
  'LOG_FILE_PATH',
  'RATE_LIMIT_WINDOW_MS',
  'RATE_LIMIT_MAX_REQUESTS',
  'OPENROUTER_API_KEY',
  'OPENROUTER_BASE_URL',
  'OPENROUTER_MODEL',
] as const;

export function validateEnv(): void {
  const missing: string[] = [];

  for (const key of REQUIRED_ENV_VARS) {
    if (process.env[key] === undefined || process.env[key] === null) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `[Config Error] Missing required environment variables in .env:\n  - ${missing.join('\n  - ')}`
    );
  }
}
