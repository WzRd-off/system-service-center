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

  async createForRequest(requestId, type, extraText = null) {
    try {
      const { rows } = await db.query(
        `SELECT sr.user_id, sr.request_number, sr.status,
                nt.label AS type_label,
                rs.label AS status_label
         FROM service_requests sr
         LEFT JOIN notification_types nt ON nt.code = $2
         LEFT JOIN request_statuses rs ON rs.code = sr.status
         WHERE sr.id = $1`,
        [requestId, type]
      );
      const row = rows[0];
      if (!row || !row.user_id) return null;

      const baseLabel = row.type_label || type;
      const tail =
        type === 'status_changed'
          ? `: ${row.status_label || row.status}`
          : extraText
            ? `: ${extraText}`
            : '';
      const message = `Заявка №${row.request_number} — ${baseLabel}${tail}`;

      return await this.create({
        userId: row.user_id,
        requestId,
        type,
        message
      });
    } catch (err) {
      console.warn('[notifications] createForRequest failed:', err.message);
      return null;
    }
  }

  async listForUser(userId, { onlyUnread = false, limit = 50, offset = 0 } = {}) {
    const params = [userId];
    let where = 'n.user_id = $1';
    if (onlyUnread) where += ' AND n.is_read = FALSE';
    params.push(limit, offset);

    const { rows } = await db.query(
      `SELECT n.*, nt.label AS type_label, sr.request_number
       FROM notifications n
       LEFT JOIN notification_types nt ON nt.code = n.type
       LEFT JOIN service_requests sr ON sr.id = n.request_id
       WHERE ${where}
       ORDER BY n.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    return rows;
  }

  async getUnreadCount(userId) {
    const { rows } = await db.query(
      'SELECT COUNT(*)::int AS count FROM notifications WHERE user_id = $1 AND is_read = FALSE',
      [userId]
    );
    return rows[0]?.count ?? 0;
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

  async markAllAsRead(userId) {
    const { rowCount } = await db.query(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE',
      [userId]
    );
    return { updated: rowCount };
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
