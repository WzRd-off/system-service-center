import { api } from './client.js';

export const notificationsApi = {
  list: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  remove: (id) => api.delete(`/notifications/${id}`)
};
