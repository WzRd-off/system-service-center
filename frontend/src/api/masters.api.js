import { api } from './client.js';

export const mastersApi = {
  list: () => api.get('/masters'),
  create: (data) => api.post('/masters', data),
  remove: (id) => api.delete(`/masters/${id}`),
  getAssignedRequests: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    return api.get(`/masters/requests${qs ? `?${qs}` : ''}`);
  },
  updateRequestStatus: (id, status) =>
    api.patch(`/masters/requests/${id}/status`, { status }),
  addWorkReport: (data) => api.post('/masters/work-reports', data),
  notifyManagerCompleted: (requestId) =>
    api.post(`/masters/requests/${requestId}/notify-completion`),
};
