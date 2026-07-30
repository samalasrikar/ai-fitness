import { apiClient } from '../../../lib/axios';

export const aiCoachApi = {
  getHistory: async () => {
    return apiClient.get('/ai-coach/history');
  },
  sendMessage: async (text) => {
    return apiClient.post('/ai-coach/chat', { text });
  }
};
