import { apiClient } from '../../lib/axios';

export const profileApi = {
  getProfile: () => apiClient.get('/profile'),
  updateProfile: (data) => apiClient.put('/profile', data),
};
