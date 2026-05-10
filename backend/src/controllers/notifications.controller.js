import { notificationsService } from '../services/notifications.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const notificationsController = {
  list: asyncHandler(async (req, res) => {
    const { unread, limit, offset } = req.query;
    const notifications = await notificationsService.listForUser(req.user.id, {
      onlyUnread: unread === '1' || unread === 'true',
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined
    });
    res.json(notifications);
  }),

  unreadCount: asyncHandler(async (req, res) => {
    const count = await notificationsService.getUnreadCount(req.user.id);
    res.json({ count });
  }),

  markAsRead: asyncHandler(async (req, res) => {
    const notification = await notificationsService.markAsRead(Number(req.params.id), req.user.id);
    res.json(notification);
  }),

  markAllAsRead: asyncHandler(async (req, res) => {
    const result = await notificationsService.markAllAsRead(req.user.id);
    res.json(result);
  }),

  remove: asyncHandler(async (req, res) => {
    await notificationsService.remove(Number(req.params.id), req.user.id);
    res.status(204).end();
  })
};
