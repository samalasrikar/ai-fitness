import { apiClient } from '../../lib/axios';

export const exerciseApi = {
  getExercises: (search = '', category = '') => apiClient.get('/exercises', { params: { search, category } }),
  getExerciseById: (id) => apiClient.get(`/exercises/${id}`),
  getAlternatives: (exerciseName = '') => apiClient.get('/exercises/alternatives', { params: { exerciseName } }),
};
