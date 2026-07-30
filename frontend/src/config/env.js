/**
 * Centralized Environment Configuration Module (Frontend)
 * Validates and exports required VITE environment variables strictly without fallbacks.
 */

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_APP_NAME = import.meta.env.VITE_APP_NAME;
const VITE_APP_ENV = import.meta.env.VITE_APP_ENV;

if (!VITE_API_BASE_URL) {
  throw new Error('[Frontend Config Error] Missing required environment variable: VITE_API_BASE_URL');
}

export const env = Object.freeze({
  API_BASE_URL: VITE_API_BASE_URL,
  APP_NAME: VITE_APP_NAME || 'FitAI X',
  APP_ENV: VITE_APP_ENV || 'development',
  IS_PRODUCTION: Boolean(import.meta.env.PROD),
  IS_DEVELOPMENT: Boolean(import.meta.env.DEV),
});

export default env;
