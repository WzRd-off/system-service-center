import { Router } from 'express';
import { equipmentController } from '../controllers/equipment.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', equipmentController.create);
router.get('/client/:userId', equipmentController.listByUser);
router.get('/:id/history', equipmentController.getHistory);
router.get('/:id', equipmentController.getById);
router.delete('/:id', equipmentController.remove);

export default router;
