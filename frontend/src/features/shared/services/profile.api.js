import { apiClient } from '../../../lib/axios';

export const profileApi = {
  getProfile: async () => {
    return apiClient.get('/profile');
  },
  updateProfile: async (data) => {
    return apiClient.put('/profile', data);
  },
  updateGoals: async (goals) => {
    return apiClient.put('/profile/goals', { goals });
  },
  updatePreferences: async (preferences) => {
    return apiClient.put('/profile/preferences', { preferences });
  }
};
