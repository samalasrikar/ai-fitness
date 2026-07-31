/**
 * Centralized Environment Configuration Module (Frontend)
 * Validates and exports required VITE environment variables strictly without fallbacks.
 */

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const VITE_APP_NAME = import.meta.env.VITE_APP_NAME || 'FitAI X';
const VITE_APP_ENV = import.meta.env.VITE_APP_ENV || (import.meta.env.PROD ? 'production' : 'development');

if (!import.meta.env.VITE_API_BASE_URL && !import.meta.env.VITE_API_URL && import.meta.env.PROD) {
  console.warn('[Frontend Config Warning] Neither VITE_API_BASE_URL nor VITE_API_URL is defined. Falling back to relative default.');
}

export const env = Object.freeze({
  API_BASE_URL: VITE_API_BASE_URL,
  APP_NAME: VITE_APP_NAME,
  APP_ENV: VITE_APP_ENV,
  IS_PRODUCTION: Boolean(import.meta.env.PROD),
  IS_DEVELOPMENT: Boolean(import.meta.env.DEV),
});

export default env;
