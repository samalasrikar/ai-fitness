import { apiClient } from '../../lib/axios';

export const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  signup: (userData) => apiClient.post('/auth/register', userData),
  logout: () => apiClient.post('/auth/logout'),
  getMe: () => apiClient.get('/auth/me'),
  refresh: () => apiClient.post('/auth/refresh'),
};
