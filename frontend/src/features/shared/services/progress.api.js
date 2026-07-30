import { apiClient } from '../../../lib/axios';

export const progressApi = {
  getDashboardMetrics: async () => {
    return apiClient.get('/progress/dashboard');
  },
  toggleChallenge: async () => {
    return apiClient.post('/progress/challenge/toggle');
  },
  getRecordsSummary: async () => {
    return apiClient.get('/progress/records/summary');
  },
  getPersonalRecords: async () => {
    return apiClient.get('/progress/records');
  },
  createPersonalRecord: async (recordData) => {
    return apiClient.post('/progress/records', recordData);
  },
  deletePersonalRecord: async (id) => {
    return apiClient.delete(`/progress/records/${id}`);
  }
};
