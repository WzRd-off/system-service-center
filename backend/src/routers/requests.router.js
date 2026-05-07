import { Router } from 'express';
import { requestsController } from '../controllers/requests.controller.js';
import { authMiddleware, managerMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', requestsController.create);
router.get('/', requestsController.list);
router.get('/:id', requestsController.getById);
router.patch('/:id/status', managerMiddleware,requestsController.updateStatus);
router.patch('/:id/assign', managerMiddleware, requestsController.assignTechnician);

export default router;
