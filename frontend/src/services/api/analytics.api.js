import { apiClient } from '../../lib/axios';

export const analyticsApi = {
  getOverloadAnalysis: () => apiClient.get('/analytics/overload'),
  getPerformanceLab: () => apiClient.get('/analytics/performance-lab'),
  getGoalDrift: () => apiClient.get('/analytics/goal-drift'),
};
