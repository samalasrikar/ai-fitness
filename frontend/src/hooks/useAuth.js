import { useAuthContext } from '../providers/AuthContext';

/**
 * Custom hook wrapping AuthContext for backward-compatibility
 * Completely removes localStorage usage in favor of secure in-memory token state
 */
export function useAuth() {
  const auth = useAuthContext();

  return {
    user: auth.user,
    loading: auth.isLoading,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    error: null,
    login: async (email, password) => auth.login({ email, password }),
    signup: async (userData) => auth.signup(userData),
    logout: auth.logout,
    refetch: auth.restoreSession,
  };
}
