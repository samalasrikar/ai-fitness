import { useAuthContext } from '../../../providers/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Shared useAuth hook consuming AuthContext for backward-compatibility
 * Removes all localStorage token access
 */
export function useAuth() {
  const auth = useAuthContext();
  const navigate = useNavigate();

  const login = async (email, password) => {
    const data = await auth.login({ email, password });
    navigate('/dashboard');
    return data;
  };

  const signup = async (firstName, lastName, email, password) => {
    const data = await auth.signup({ firstName, lastName, email, password });
    navigate('/setup');
    return data;
  };

  const logout = async () => {
    await auth.logout();
    navigate('/login');
  };

  return {
    user: auth.user,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    error: null,
    login,
    signup,
    logout,
  };
}
