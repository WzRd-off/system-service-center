import { Router } from 'express';
import { reportsController } from '../controllers/reports.controller.js';
import { authMiddleware, managerMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware, managerMiddleware);

router.get('/requests-by-status', reportsController.requestsByStatus);
router.get('/technicians', reportsController.technicianActivity);
router.get('/business-clients', reportsController.businessClientActivity);
router.get('/technician-workload', reportsController.technicianWorkload);

export default router;
