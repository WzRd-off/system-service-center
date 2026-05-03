import { api } from './client.js';

export const businessClientsApi = {
  getProfile: () => api.get('/business-clients/profile'),
  getDevices: () => api.get('/business-clients/devices'),
  getRequests: () => api.get('/business-clients/requests'),
  getMaintenancePlans: () => api.get('/business-clients/maintenance-plans'),
  createMaintenancePlan: (data) => api.post('/business-clients/maintenance-plans', data)
};
