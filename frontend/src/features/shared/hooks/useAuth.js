import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/auth.api';

export function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchMe = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        if (isMounted) setIsLoading(false);
        return;
      }
      try {
        const response = await authApi.getMe();
        if (isMounted && response.data) {
          setUser(response.data);
          localStorage.setItem('userProfile', JSON.stringify({
            displayName: `${response.data.firstName} ${response.data.lastName}`,
            username: `@${response.data.firstName.toLowerCase()}_fit`
          }));
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchMe();
    return () => { isMounted = false; };
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login({ email, password });
      const { user: userData, accessToken } = response.data || {};
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('isLoggedIn', 'true');
      }
      if (userData) {
        setUser(userData);
        localStorage.setItem('userProfile', JSON.stringify({
          displayName: `${userData.firstName} ${userData.lastName}`,
          username: `@${userData.firstName.toLowerCase()}_fit`
        }));
      }
      navigate('/dashboard');
      return response.data;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (firstName, lastName, email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.register({ firstName, lastName, email, password });
      const { user: userData, accessToken } = response.data || {};
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('isLoggedIn', 'true');
      }
      if (userData) {
        setUser(userData);
        localStorage.setItem('userProfile', JSON.stringify({
          displayName: `${userData.firstName} ${userData.lastName}`,
          username: `@${userData.firstName.toLowerCase()}_fit`
        }));
      }
      navigate('/onboarding');
      return response.data;
    } catch (err) {
      setError(err.message || 'Signup failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {}
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isLoggedIn');
    setUser(null);
    navigate('/login');
  };

  return {
    user,
    isLoading,
    error,
    login,
    signup,
    logout
  };
}
