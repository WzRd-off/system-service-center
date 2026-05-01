import { Router } from 'express';
import { mastersController } from '../controllers/masters.controller.js';
import { authMiddleware, masterMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware, masterMiddleware);

router.get('/requests', mastersController.getAssignedRequests);
router.patch('/requests/:id/status', mastersController.updateRequestStatus);
router.post('/work-reports', mastersController.addWorkReport);

export default router;
