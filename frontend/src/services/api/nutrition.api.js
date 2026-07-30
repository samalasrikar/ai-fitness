import { apiClient } from '../../lib/axios';

export const nutritionApi = {
  getSummary: () => apiClient.get('/nutrition/summary'),
  getLoggedMeals: () => apiClient.get('/nutrition/meals'),
  logMeal: (mealData) => apiClient.post('/nutrition/meals', mealData),
  deleteMeal: (id) => apiClient.delete(`/nutrition/meals/${id}`),
  analyzeMeal: (description) => apiClient.post('/nutrition/analyze', { description }),
  getRecommendations: (data) => apiClient.post('/nutrition/recommendations', data),
};
