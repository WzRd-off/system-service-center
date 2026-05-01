import { Router } from 'express';
import { commentsController } from '../controllers/comments.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', commentsController.create);
router.get('/request/:requestId', commentsController.listByRequest);
router.put('/:id', commentsController.update);

export default router;
