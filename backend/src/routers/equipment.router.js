import { Router } from 'express';
import { equipmentController } from '../controllers/equipment.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', equipmentController.create);
router.get('/:id', equipmentController.getById);
router.get('/:id/history', equipmentController.getHistory);
router.get('/user/:userId', equipmentController.listByUser);

export default router;
