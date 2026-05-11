import { api } from './client.js';

function periodQs(opts = {}) {
  const p = new URLSearchParams();
  if (opts.dateFrom) p.set('dateFrom', opts.dateFrom);
  if (opts.dateTo) p.set('dateTo', opts.dateTo);
  const s = p.toString();
  return s ? `?${s}` : '';
}

export const reportsApi = {
  requestsByStatus: (opts) => api.get(`/reports/requests-by-status${periodQs(opts)}`),
  technicianActivity: (opts) => api.get(`/reports/technicians${periodQs(opts)}`),
  businessClientActivity: (opts) => api.get(`/reports/business-clients${periodQs(opts)}`),
  technicianWorkload: () => api.get('/reports/technician-workload'),
};
