import { api } from './client.js'; 

export const businessClientsApi = {   
  list: () => api.get('/business-clients'),     
  getDevicesById: (id) => api.get(`/business-clients/${id}/devices`),   
  getProfile: () => api.get('/business-clients/profile'),   
  updateProfile: (data) => api.put('/business-clients/profile', data),   
  getDevices: () => api.get('/business-clients/devices'),   
  getRequests: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    return api.get(`/business-clients/requests${qs ? `?${qs}` : ''}`);
  },
  getMaintenancePlans: () => api.get('/business-clients/maintenance-plans'),   
  createMaintenancePlan: (data) => api.post('/business-clients/maintenance-plans', data),
};