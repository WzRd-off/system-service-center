import { api } from './client.js';

const buildQuery = (params = {}) => {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    usp.append(key, value);
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : '';
};

export const notificationsApi = {
  list: ({ unread, limit, offset } = {}) =>
    api.get(`/notifications${buildQuery({ unread: unread ? 1 : undefined, limit, offset })}`),
  unreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
  remove: (id) => api.delete(`/notifications/${id}`)
};
