export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',

  CLIENT: {
    DASHBOARD: '/client',
    NEW_REQUEST: '/client/new-request',
    REQUESTS: '/client/requests',
    REQUEST_DETAILS: '/client/requests/:id',
    HISTORY: '/client/history'
  },

  MANAGER: {
    DASHBOARD: '/manager',
    REQUESTS: '/manager/requests',
    REQUEST_DETAILS: '/manager/requests/:id',
    BUSINESS_CLIENTS: '/manager/business-clients',
    ANALYTICS: '/manager/analytics'
  },

  MASTER: {
    DASHBOARD: '/master',
    REQUESTS: '/master/requests',
    REQUEST_DETAILS: '/master/requests/:id'
  },

  BUSINESS: {
    DASHBOARD: '/business',
    PROFILE: '/business/profile',
    DEVICES: '/business/devices',
    NEW_REQUEST: '/business/new-request',
    HISTORY: '/business/history',
    REQUEST_DETAILS: '/business/history/:id',
    MAINTENANCE: '/business/maintenance'
  }
};
