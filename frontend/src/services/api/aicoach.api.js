import { apiClient } from '../../lib/axios';

export const aiCoachApi = {
  getHistory: () => apiClient.get('/ai-coach/history'),
  sendMessage: (text) => apiClient.post('/ai-coach/chat', { text }),
  generateWorkout: (params) => apiClient.post('/ai-coach/generate-workout', params),
  getInjuryGuard: () => apiClient.get('/ai-coach/injury-guard'),
  logInjury: (injuryData) => apiClient.post('/ai-coach/injury-log', injuryData),
  getExerciseAnalysis: (exerciseId) => apiClient.get('/ai-coach/exercise-analysis', { params: { exerciseId } }),
};
