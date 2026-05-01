import { Router } from 'express';
import { notificationsController } from '../controllers/notifications.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', notificationsController.list);
router.patch('/:id/read', notificationsController.markAsRead);
router.delete('/:id', notificationsController.remove);

export default router;
