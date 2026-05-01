import { Router } from 'express';
import { usersController } from '../controllers/users.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);
router.get('/profile', usersController.getProfile);
router.put('/profile', usersController.updateProfile);

export default router;
