import { api } from './client.js';

export const requestsApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/requests${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => api.get(`/requests/${id}`),
  create: (data) => api.post('/requests', data),
  updateStatus: (id, status) => api.patch(`/requests/${id}/status`, { status }),
  assignTechnician: (id, technicianId) => api.patch(`/requests/${id}/assign`, { technicianId })
};
