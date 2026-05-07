import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes.js';
import { ROLES } from '../constants/roles.js';
import { ProtectedRoute } from './ProtectedRoute.jsx';

import { LoginPage } from '../pages/auth/LoginPage.jsx';
import { RegisterPage } from '../pages/auth/RegisterPage.jsx';

import { ClientDashboard } from '../pages/client/ClientDashboard.jsx';
import { NewRequestPage } from '../pages/client/NewRequestPage.jsx';
import { MyRequestsPage } from '../pages/client/MyRequestsPage.jsx';
import { ClientRequestDetailsPage } from '../pages/client/RequestDetailsPage.jsx';
import { ClientHistoryPage } from '../pages/client/HistoryPage.jsx';

import { ManagerDashboard } from '../pages/manager/ManagerDashboard.jsx';
import { AllRequestsPage } from '../pages/manager/AllRequestsPage.jsx';
import { ManagerRequestDetailsPage } from '../pages/manager/RequestDetailsPage.jsx';
import { BusinessClientsPage } from '../pages/manager/BusinessClientsPage.jsx';
import { CreateMasterPage } from '../pages/manager/CreateMasterPage.jsx';
import { AnalyticsPage } from '../pages/manager/AnalyticsPage.jsx';

import { MasterDashboard } from '../pages/master/MasterDashboard.jsx';
import { AssignedRequestsPage } from '../pages/master/AssignedRequestsPage.jsx';
import { MasterRequestDetailsPage } from '../pages/master/RequestDetailsPage.jsx';

import { BusinessDashboard } from '../pages/business/BusinessDashboard.jsx';
import { CompanyProfilePage } from '../pages/business/CompanyProfilePage.jsx';
import { CompanyDevicesPage } from '../pages/business/CompanyDevicesPage.jsx';
import { BusinessNewRequestPage } from '../pages/business/NewRequestPage.jsx';
import { ServiceHistoryPage } from '../pages/business/ServiceHistoryPage.jsx';
import { MaintenancePlansPage } from '../pages/business/MaintenancePlansPage.jsx';

import { ProfilePage } from '../pages/ProfilePage.jsx';
import { NotFoundPage } from '../pages/NotFoundPage.jsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

      <Route path={ROUTES.PROFILE} element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      <Route path={ROUTES.CLIENT.DASHBOARD} element={<ProtectedRoute roles={[ROLES.CLIENT]}><ClientDashboard /></ProtectedRoute>} />
      <Route path={ROUTES.CLIENT.NEW_REQUEST} element={<ProtectedRoute roles={[ROLES.CLIENT]}><NewRequestPage /></ProtectedRoute>} />
      <Route path={ROUTES.CLIENT.REQUESTS} element={<ProtectedRoute roles={[ROLES.CLIENT]}><MyRequestsPage /></ProtectedRoute>} />
      <Route path={ROUTES.CLIENT.REQUEST_DETAILS} element={<ProtectedRoute roles={[ROLES.CLIENT]}><ClientRequestDetailsPage /></ProtectedRoute>} />
      <Route path={ROUTES.CLIENT.HISTORY} element={<ProtectedRoute roles={[ROLES.CLIENT]}><ClientHistoryPage /></ProtectedRoute>} />

      <Route path={ROUTES.MANAGER.DASHBOARD} element={<ProtectedRoute roles={[ROLES.MANAGER]}><ManagerDashboard /></ProtectedRoute>} />
      <Route path={ROUTES.MANAGER.REQUESTS} element={<ProtectedRoute roles={[ROLES.MANAGER]}><AllRequestsPage /></ProtectedRoute>} />
      <Route path={ROUTES.MANAGER.REQUEST_DETAILS} element={<ProtectedRoute roles={[ROLES.MANAGER]}><ManagerRequestDetailsPage /></ProtectedRoute>} />
      <Route path={ROUTES.MANAGER.BUSINESS_CLIENTS} element={<ProtectedRoute roles={[ROLES.MANAGER]}><BusinessClientsPage /></ProtectedRoute>} />
      <Route path={ROUTES.MANAGER.MASTERS} element={<ProtectedRoute roles={[ROLES.MANAGER]}><CreateMasterPage /></ProtectedRoute>} />
      <Route path={ROUTES.MANAGER.ANALYTICS} element={<ProtectedRoute roles={[ROLES.MANAGER]}><AnalyticsPage /></ProtectedRoute>} />

      <Route path={ROUTES.MASTER.DASHBOARD} element={<ProtectedRoute roles={[ROLES.TECHNICIAN]}><MasterDashboard /></ProtectedRoute>} />
      <Route path={ROUTES.MASTER.REQUESTS} element={<ProtectedRoute roles={[ROLES.TECHNICIAN]}><AssignedRequestsPage /></ProtectedRoute>} />
      <Route path={ROUTES.MASTER.REQUEST_DETAILS} element={<ProtectedRoute roles={[ROLES.TECHNICIAN]}><MasterRequestDetailsPage /></ProtectedRoute>} />

      <Route path={ROUTES.BUSINESS.DASHBOARD} element={<ProtectedRoute roles={[ROLES.BUSINESS_CLIENT]}><BusinessDashboard /></ProtectedRoute>} />
      <Route path={ROUTES.BUSINESS.PROFILE} element={<ProtectedRoute roles={[ROLES.BUSINESS_CLIENT]}><CompanyProfilePage /></ProtectedRoute>} />
      <Route path={ROUTES.BUSINESS.DEVICES} element={<ProtectedRoute roles={[ROLES.BUSINESS_CLIENT]}><CompanyDevicesPage /></ProtectedRoute>} />
      <Route path={ROUTES.BUSINESS.NEW_REQUEST} element={<ProtectedRoute roles={[ROLES.BUSINESS_CLIENT]}><BusinessNewRequestPage /></ProtectedRoute>} />
      <Route path={ROUTES.BUSINESS.HISTORY} element={<ProtectedRoute roles={[ROLES.BUSINESS_CLIENT]}><ServiceHistoryPage /></ProtectedRoute>} />
      <Route path={ROUTES.BUSINESS.REQUEST_DETAILS} element={<ProtectedRoute roles={[ROLES.BUSINESS_CLIENT]}><ClientRequestDetailsPage /></ProtectedRoute>} />
      <Route path={ROUTES.BUSINESS.MAINTENANCE} element={<ProtectedRoute roles={[ROLES.BUSINESS_CLIENT]}><MaintenancePlansPage /></ProtectedRoute>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
