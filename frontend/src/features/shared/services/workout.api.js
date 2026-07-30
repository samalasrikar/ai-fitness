import { apiClient } from '../../../lib/axios';

export const workoutApi = {
  getActivePlan: async () => {
    return apiClient.get('/workouts/active');
  },
  generatePlan: async () => {
    return apiClient.post('/workouts/generate');
  },
  resetPlan: async () => {
    return apiClient.delete('/workouts/active');
  }
};
