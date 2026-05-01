import { Router } from 'express';
import { businessClientsController } from '../controllers/businessClients.controller.js';
import { authMiddleware, businessMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware, businessMiddleware);

router.get('/profile', businessClientsController.getProfile);
router.get('/devices', businessClientsController.getDevices);
router.get('/requests', businessClientsController.getRequests);
router.get('/maintenance-plans', businessClientsController.getMaintenancePlans);
router.post('/maintenance-plans', businessClientsController.createMaintenancePlan);

export default router;
