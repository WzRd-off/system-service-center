import { api } from './client.js';

export const usersApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  listOrderableClients: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.search != null && String(params.search).trim() !== '') {
      qs.set('search', String(params.search).trim());
    }
    if (params.limit != null) qs.set('limit', String(params.limit));
    const s = qs.toString();
    return api.get(`/users/clients${s ? `?${s}` : ''}`);
  },
};
