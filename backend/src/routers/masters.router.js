import { Router } from 'express';
import { mastersController } from '../controllers/masters.controller.js';
import {
  authMiddleware,
  masterMiddleware,
  managerMiddleware,
} from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', managerMiddleware, mastersController.list);
router.post('/', managerMiddleware, mastersController.create);
router.delete('/:id', managerMiddleware, mastersController.remove);

router.get('/requests', masterMiddleware, mastersController.getAssignedRequests);
router.patch('/requests/:id/status', masterMiddleware, mastersController.updateRequestStatus);
router.post('/requests/:id/notify-completion', masterMiddleware, mastersController.notifyCompletion);
router.post('/work-reports', masterMiddleware, mastersController.addWorkReport);

export default router;
