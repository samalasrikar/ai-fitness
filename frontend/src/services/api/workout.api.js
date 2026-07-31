import { apiClient } from '../../lib/axios';

export const workoutApi = {
  getHomeSummary: () => apiClient.get('/workouts/home-summary'),
  getActivePlan: () => apiClient.get('/workouts/active'),
  getDailyWorkout: (day) => apiClient.get('/workouts/daily', { params: { day } }),
  generatePlan: () => apiClient.post('/workouts/generate'),
  generateAIWorkout: (data) => apiClient.post('/workouts/generate-ai', data),
  createManualPlan: (data) => apiClient.post('/workouts/manual', data),
  resetPlan: () => apiClient.post('/workouts/reset'),
  replaceExercise: (params) => apiClient.get('/workouts/replace-exercise', { params }),
  getWeeklyAnalytics: () => apiClient.get('/workouts/analytics'),
  getAIRecommendations: () => apiClient.get('/workouts/recommendations'),
  logSession: (sessionData) => apiClient.post('/workouts/log-session', sessionData),
  getHistory: () => apiClient.get('/workouts/history'),
  getSessionById: (id) => apiClient.get(`/workouts/history/${id}`),
  deleteHistoryItem: (id) => apiClient.delete(`/workouts/history/${id}`),
  getTemplates: () => apiClient.get('/workouts/templates'),
  createTemplate: (data) => apiClient.post('/workouts/templates', data),
  deleteTemplate: (id) => apiClient.delete(`/workouts/templates/${id}`),
};
