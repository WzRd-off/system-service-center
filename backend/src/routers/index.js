import { Router } from 'express';
import authRouter from './auth.router.js';
import usersRouter from './users.router.js';
import requestsRouter from './requests.router.js';
import mastersRouter from './masters.router.js';
import businessClientsRouter from './businessClients.router.js';
import equipmentRouter from './equipment.router.js';
import commentsRouter from './comments.router.js';
import notificationsRouter from './notifications.router.js';
import reportsRouter from './reports.router.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/requests', requestsRouter);
router.use('/masters', mastersRouter);
router.use('/business-clients', businessClientsRouter);
router.use('/equipment', equipmentRouter);
router.use('/comments', commentsRouter);
router.use('/notifications', notificationsRouter);
router.use('/reports', reportsRouter);

export default router;
