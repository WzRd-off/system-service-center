import { db } from '../database/db.js';
import { ApiError } from '../utils/ApiError.js';

class NotificationsService {
  async create({ userId, requestId, type, message }) {
    const { rows } = await db.query(
      `INSERT INTO notifications (user_id, request_id, type, message)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, requestId, type, message]
    );
    return rows[0];
  }

  async listForUser(userId) {
    const { rows } = await db.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }

  async markAsRead(id, userId) {
    const { rows } = await db.query(
      `UPDATE notifications SET is_read = TRUE
       WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );
    if (!rows[0]) throw ApiError.notFound('Notification not found');
    return rows[0];
  }

  async remove(id, userId) {
    const { rowCount } = await db.query(
      'DELETE FROM notifications WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    if (!rowCount) throw ApiError.notFound('Notification not found');
    return true;
  }
}

export const notificationsService = new NotificationsService();