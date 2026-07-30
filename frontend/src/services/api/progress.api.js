import { apiClient } from '../../lib/axios';

export const progressApi = {
  getDashboard: () => apiClient.get('/progress/dashboard'),
  toggleChallenge: () => apiClient.post('/progress/challenge/toggle'),
  getRecordsSummary: () => apiClient.get('/progress/records/summary'),
  getPersonalRecords: () => apiClient.get('/progress/records'),
  createPersonalRecord: (recordData) => apiClient.post('/progress/records', recordData),
  deletePersonalRecord: (id) => apiClient.delete(`/progress/records/${id}`),
};
