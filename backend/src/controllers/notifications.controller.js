import { notificationsService } from '../services/notifications.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const notificationsController = {
  list: asyncHandler(async (req, res) => {
    const notifications = await notificationsService.listForUser(req.user.id);
    res.json(notifications);
  }),

  markAsRead: asyncHandler(async (req, res) => {
    const notification = await notificationsService.markAsRead(Number(req.params.id), req.user.id);
    res.json(notification);
  }),

  remove: asyncHandler(async (req, res) => {
    await notificationsService.remove(Number(req.params.id), req.user.id);
    res.status(204).end();
  })
};
