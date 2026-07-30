import { apiClient } from '../../../lib/axios';

export const onboardingApi = {
  submitOnboarding: async (onboardingData) => {
    return apiClient.post('/onboarding/complete', onboardingData);
  },
  getStatus: async () => {
    return apiClient.get('/onboarding/status');
  }
};
