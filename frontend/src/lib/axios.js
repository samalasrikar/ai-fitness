import axios from 'axios';
import { env } from '../config/env';

// ── In-Memory Token & Abort Controller State ──────────────────────────────
let inMemoryAccessToken = null;
let sessionAbortController = new AbortController();

/**
 * Returns current in-memory access token (never stored in localStorage)
 */
export function getAccessToken() {
  return inMemoryAccessToken;
}

/**
 * Updates in-memory access token
 */
export function setAccessToken(token) {
  inMemoryAccessToken = token;
}

/**
 * Clears in-memory access token
 */
export function clearAccessToken() {
  inMemoryAccessToken = null;
}

/**
 * Cancels all currently in-flight Axios requests
 */
export function cancelPendingRequests(reason = 'Session invalidated') {
  sessionAbortController.abort(reason);
  sessionAbortController = new AbortController();
}

// ── Axios Instance ─────────────────────────────────────────────────────────
export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000,
});

// Request interceptor: attach in-memory Bearer token & AbortController signal
apiClient.interceptors.request.use(
  (config) => {
    if (inMemoryAccessToken) {
      config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
    }

    // Attach session abort signal unless caller supplied an explicit signal
    if (!config.signal) {
      config.signal = sessionAbortController.signal;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh Lock & Single Promise Queue
let refreshPromise = null;

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    // Ignore canceled requests
    if (axios.isCancel(error) || error?.name === 'CanceledError') {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') ||
                           originalRequest?.url?.includes('/auth/register') ||
                           originalRequest?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      // If refresh is not already running, initiate single refresh promise
      if (!refreshPromise) {
        refreshPromise = axios.post(
          `${env.API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )
          .then((res) => {
            const newAccessToken = res.data?.data?.accessToken || res.data?.accessToken;
            if (!newAccessToken) {
              throw new Error('Refresh token response did not contain access token');
            }
            setAccessToken(newAccessToken);
            apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
            return newAccessToken;
          })
          .catch((err) => {
            clearAccessToken();
            cancelPendingRequests('Authentication refresh failed');
            throw err;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      // Wait for shared refresh promise to resolve or fail
      try {
        const newAccessToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshErr) {
        const customError = {
          message: refreshErr?.response?.data?.message || refreshErr?.message || 'Session expired. Please log in again.',
          statusCode: refreshErr?.response?.status || 401,
          errors: refreshErr?.response?.data?.errors || [],
        };
        return Promise.reject(customError);
      }
    }

    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      statusCode: error.response?.status || 500,
      errors: error.response?.data?.errors || [],
    };
    return Promise.reject(customError);
  }
);
