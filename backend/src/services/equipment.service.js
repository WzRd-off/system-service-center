import { db } from '../database/db.js';
import { ApiError } from '../utils/ApiError.js';

class EquipmentService {
  async create({ userId, type, manufacturer, model, serialNumber, notes }) {
    if (!userId) throw ApiError.badRequest('Device owner is required');

    const { rows } = await db.query(
      `INSERT INTO devices (user_id, type, manufacturer, model, serial_number, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, type, manufacturer, model, serialNumber, notes]
    );
    return rows[0];
  }

  async listByUser(userId) {
    const { rows } = await db.query('SELECT * FROM devices WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return rows;
  }

  async getHistory(deviceId) {
    const { rows } = await db.query(
      `SELECT sr.id, sr.request_number, sr.user_id, sr.device_id, sr.description, sr.status,
              sr.created_at, sr.updated_at,
              wr.diagnostic_result, wr.work_description, wr.used_parts
       FROM service_requests sr
       LEFT JOIN LATERAL (
         SELECT diagnostic_result, work_description, used_parts
         FROM work_reports
         WHERE request_id = sr.id
         ORDER BY created_at DESC
         LIMIT 1
       ) wr ON TRUE
       WHERE sr.device_id = $1
       ORDER BY sr.created_at DESC`,
      [deviceId]
    );
    return rows;
  }

  async getById(id) {
    const { rows } = await db.query('SELECT * FROM devices WHERE id = $1', [id]);
    if (!rows[0]) throw ApiError.notFound('Device not found');
    return rows[0];
  }

  async deleteById(id) {
    const { rows: reqRows } = await db.query(
      'SELECT COUNT(*)::int AS c FROM service_requests WHERE device_id = $1',
      [id]
    );
    if (reqRows[0].c > 0) {
      throw ApiError.conflict('Неможливо видалити техніку: є пов’язані заявки');
    }
    const { rows: mpRows } = await db.query(
      'SELECT COUNT(*)::int AS c FROM maintenance_plans WHERE device_id = $1',
      [id]
    );
    if (mpRows[0].c > 0) {
      throw ApiError.conflict('Неможливо видалити техніку: є пов’язані плани обслуговування');
    }
    const { rowCount } = await db.query('DELETE FROM devices WHERE id = $1', [id]);
    if (!rowCount) throw ApiError.notFound('Device not found');
  }
}

export const equipmentService = new EquipmentService();