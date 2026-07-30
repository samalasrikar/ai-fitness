import dotenv from 'dotenv';
import path from 'path';
import { validateEnv } from './validateEnv';

// Load .env file at entry point
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Validate environment variables strictly at startup
validateEnv();

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined || value === null) {
    throw new Error(`[Config Error] Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  // Server
  NODE_ENV: getRequiredEnv('NODE_ENV'),
  PORT: parseInt(getRequiredEnv('PORT'), 10),
  API_PREFIX: getRequiredEnv('API_PREFIX'),
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_TEST: process.env.NODE_ENV === 'test',

  // Database
  DATABASE_URL: getRequiredEnv('DATABASE_URL'),

  // Redis & Queue
  REDIS_HOST: getRequiredEnv('REDIS_HOST'),
  REDIS_PORT: parseInt(getRequiredEnv('REDIS_PORT'), 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || undefined,
  REDIS_URL: getRequiredEnv('REDIS_URL'),
  QUEUE_REDIS_HOST: getRequiredEnv('QUEUE_REDIS_HOST'),
  QUEUE_REDIS_PORT: parseInt(getRequiredEnv('QUEUE_REDIS_PORT'), 10),

  // JWT
  JWT_ACCESS_SECRET: getRequiredEnv('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: getRequiredEnv('JWT_REFRESH_SECRET'),
  JWT_ACCESS_EXPIRES_IN: getRequiredEnv('JWT_ACCESS_EXPIRES_IN'),
  JWT_REFRESH_EXPIRES_IN: getRequiredEnv('JWT_REFRESH_EXPIRES_IN'),

  // CORS & Cookie
  CORS_ORIGIN: getRequiredEnv('CORS_ORIGIN'),
  CORS_CREDENTIALS: getRequiredEnv('CORS_CREDENTIALS') === 'true',
  COOKIE_SECRET: getRequiredEnv('COOKIE_SECRET'),

  // Logging
  LOG_LEVEL: getRequiredEnv('LOG_LEVEL'),
  LOG_FILE_PATH: getRequiredEnv('LOG_FILE_PATH'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(getRequiredEnv('RATE_LIMIT_WINDOW_MS'), 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(getRequiredEnv('RATE_LIMIT_MAX_REQUESTS'), 10),

  // OpenRouter LLM AI Engine
  OPENROUTER_API_KEY: getRequiredEnv('OPENROUTER_API_KEY'),
  OPENROUTER_BASE_URL: getRequiredEnv('OPENROUTER_BASE_URL'),
  OPENROUTER_MODEL: getRequiredEnv('OPENROUTER_MODEL'),
} as const;

export type Env = typeof env;
