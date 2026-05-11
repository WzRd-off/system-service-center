export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications',

  CLIENT: {
    DASHBOARD: '/client',
    NEW_REQUEST: '/client/new-request',
    REQUESTS: '/client/requests',
    REQUEST_DETAILS: '/client/requests/:id',
    HISTORY: '/client/history',
    DEVICES: '/client/devices',
    DEVICE_HISTORY: '/client/devices/:id/history'
  },

  MANAGER: {
    DASHBOARD: '/manager',
    NEW_REQUEST: '/manager/new-request',
    REQUESTS: '/manager/requests',
    REQUEST_DETAILS: '/manager/requests/:id',
    BUSINESS_CLIENTS: '/manager/business-clients',
    MASTERS: '/manager/masters',
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
    DEVICE_HISTORY: '/business/devices/:id/history',
    NEW_REQUEST: '/business/new-request',
    HISTORY: '/business/history',
    REQUEST_DETAILS: '/business/history/:id',
    MAINTENANCE: '/business/maintenance'
  }
};
