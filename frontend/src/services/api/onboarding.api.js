import { apiClient } from '../../lib/axios';

export const onboardingApi = {
  saveProtocol: (data) => apiClient.post('/onboarding', data),
  getProtocol: () => apiClient.get('/onboarding/protocol'),
};
