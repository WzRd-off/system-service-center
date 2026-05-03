import { Router } from 'express';
import { businessClientsController } from '../controllers/businessClients.controller.js';
import {
  authMiddleware,
  businessMiddleware,
  managerMiddleware,
} from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/profile', businessMiddleware, businessClientsController.getProfile);
router.put('/profile', businessMiddleware, businessClientsController.updateProfile);
router.get('/devices', businessMiddleware, businessClientsController.getDevices);
router.get('/requests', businessMiddleware, businessClientsController.getRequests);
router.get(
  '/maintenance-plans',
  businessMiddleware,
  businessClientsController.getMaintenancePlans
);
router.post(
  '/maintenance-plans',
  businessMiddleware,
  businessClientsController.createMaintenancePlan
);

router.get('/', managerMiddleware, businessClientsController.listAll);
router.get('/:id/devices', managerMiddleware, businessClientsController.getDevicesById);

export default router;
