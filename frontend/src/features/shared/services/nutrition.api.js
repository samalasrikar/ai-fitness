import { apiClient } from '../../../lib/axios';

export const nutritionApi = {
  getLoggedMeals: async () => {
    return apiClient.get('/nutrition/meals');
  },
  analyzeMeal: async (mealText) => {
    return apiClient.post('/nutrition/analyze', { mealText });
  },
  logMeal: async (mealData) => {
    return apiClient.post('/nutrition/log', mealData);
  }
};
