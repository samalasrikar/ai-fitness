import { apiClient } from '../../../lib/axios';

export const progressApi = {
  getDashboardMetrics: async () => {
    return apiClient.get('/progress/dashboard');
  },
  toggleChallenge: async () => {
    return apiClient.post('/progress/challenge/toggle');
  }
};
