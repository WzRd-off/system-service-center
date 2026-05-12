import { api } from './client.js';

export const equipmentApi = {
  create: (data) => api.post('/equipment', data),
  getById: (id) => api.get(`/equipment/${id}`),
  getHistory: (id) => api.get(`/equipment/${id}/history`),
  listByClient: (clientId) => api.get(`/equipment/client/${clientId}`),
  delete: (id) => api.delete(`/equipment/${id}`),
};
