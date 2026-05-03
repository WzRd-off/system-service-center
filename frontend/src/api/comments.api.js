import { api } from './client.js';

export const commentsApi = {
  create: (data) => api.post('/comments', data),
  listByRequest: (requestId) => api.get(`/comments/request/${requestId}`),
  update: (id, text) => api.put(`/comments/${id}`, { text })
};
