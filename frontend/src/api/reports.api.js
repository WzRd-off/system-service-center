import { api } from './client.js';

export const reportsApi = {
  requestsByStatus: () => api.get('/reports/requests-by-status'),
  technicianActivity: () => api.get('/reports/technicians'),
  businessClientActivity: () => api.get('/reports/business-clients')
};
