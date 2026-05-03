import { api } from './client.js';

export const mastersApi = {
  getAssignedRequests: () => api.get('/masters/requests'),
  updateRequestStatus: (id, status) => api.patch(`/masters/requests/${id}/status`, { status }),
  addWorkReport: (data) => api.post('/masters/work-reports', data)
};
