import { apiClient } from '../../lib/axios';

export const workoutApi = {
  getHomeSummary: () => apiClient.get('/workouts/home-summary'),
  getActivePlan: () => apiClient.get('/workouts/active'),
  generatePlan: () => apiClient.post('/workouts/generate'),
  createManualPlan: (data) => apiClient.post('/workouts/manual', data),
  resetPlan: () => apiClient.post('/workouts/reset'),
  logSession: (sessionData) => apiClient.post('/workouts/log-session', sessionData),
  getHistory: () => apiClient.get('/workouts/history'),
  getSessionById: (id) => apiClient.get(`/workouts/history/${id}`),
  deleteHistoryItem: (id) => apiClient.delete(`/workouts/history/${id}`),
  getTemplates: () => apiClient.get('/workouts/templates'),
  createTemplate: (data) => apiClient.post('/workouts/templates', data),
  deleteTemplate: (id) => apiClient.delete(`/workouts/templates/${id}`),
};
