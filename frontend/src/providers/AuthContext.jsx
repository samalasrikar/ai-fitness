import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { setAccessToken, getAccessToken, clearAccessToken, cancelPendingRequests, apiClient } from '../lib/axios';
import { broadcastAuthEvent, subscribeAuthEvents } from '../lib/authTabSync';

const AuthContext = createContext(null);

/**
 * Decodes JWT payload without external dependencies
 */
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef(null);

  // ── Clear Silent Refresh Timer ──────────────────────────────────────────
  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  // ── Silent Token Refresh Scheduler ──────────────────────────────────────
  const scheduleSilentRefresh = useCallback((token) => {
    clearRefreshTimer();
    if (!token) return;

    const payload = parseJwt(token);
    if (!payload || !payload.exp) return;

    const expiresAtMs = payload.exp * 1000;
    const nowMs = Date.now();
    // Refresh 60 seconds before expiration
    const refreshDelayMs = Math.max(1000, expiresAtMs - nowMs - 60000);

    refreshTimerRef.current = setTimeout(async () => {
      try {
        const res = await apiClient.post('/auth/refresh');
        const newToken = res.data?.accessToken || res.accessToken;
        if (newToken) {
          setAccessToken(newToken);
          scheduleSilentRefresh(newToken);
          broadcastAuthEvent('TOKEN_REFRESHED', { accessToken: newToken });
        }
      } catch (err) {
        // Silent refresh failed
        clearAccessToken();
        setIsAuthenticated(false);
        setUser(null);
        broadcastAuthEvent('LOGOUT');
      }
    }, refreshDelayMs);
  }, [clearRefreshTimer]);

  // ── Restore Session (Page Reload) ────────────────────────────────────────
  const restoreSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/refresh');
      const token = res.data?.accessToken || res.accessToken;
      if (token) {
        setAccessToken(token);
        setIsAuthenticated(true);
        scheduleSilentRefresh(token);

        // Fetch user profile
        try {
          const userRes = await apiClient.get('/auth/me');
          const userData = userRes.data?.user || userRes.data;
          setUser(userData);
        } catch (_) {}
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (_) {
      clearAccessToken();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [scheduleSilentRefresh]);

  // Initial session restoration on mount
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // ── Multi-Tab Event Subscription ─────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = subscribeAuthEvents((type, payload) => {
      if (type === 'LOGOUT') {
        clearRefreshTimer();
        clearAccessToken();
        cancelPendingRequests('Logged out from another tab');
        setUser(null);
        setIsAuthenticated(false);
      } else if (type === 'LOGIN') {
        if (payload.accessToken) {
          setAccessToken(payload.accessToken);
          setIsAuthenticated(true);
          setUser(payload.user || null);
          scheduleSilentRefresh(payload.accessToken);
        }
      } else if (type === 'TOKEN_REFRESHED') {
        if (payload.accessToken) {
          setAccessToken(payload.accessToken);
          scheduleSilentRefresh(payload.accessToken);
        }
      }
    });

    return () => {
      unsubscribe();
      clearRefreshTimer();
    };
  }, [clearRefreshTimer, scheduleSilentRefresh]);

  // ── Auth Actions ─────────────────────────────────────────────────────────
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/login', credentials);
      const data = res.data || res;
      const { accessToken, user: userData } = data;

      if (accessToken) {
        setAccessToken(accessToken);
        setIsAuthenticated(true);
        setUser(userData);
        scheduleSilentRefresh(accessToken);

        broadcastAuthEvent('LOGIN', { accessToken, user: userData });
      }
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userDataInput) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/register', userDataInput);
      const data = res.data || res;
      const { accessToken, user: userData } = data;

      if (accessToken) {
        setAccessToken(accessToken);
        setIsAuthenticated(true);
        setUser(userData);
        scheduleSilentRefresh(accessToken);

        broadcastAuthEvent('LOGIN', { accessToken, user: userData });
      }
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    clearRefreshTimer();
    cancelPendingRequests('User logged out');
    try {
      await apiClient.post('/auth/logout');
    } catch (_) {
    } finally {
      clearAccessToken();
      setUser(null);
      setIsAuthenticated(false);
      broadcastAuthEvent('LOGOUT');
    }
  };

  const value = {
    user,
    setUser,
    accessToken: getAccessToken(),
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    restoreSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
