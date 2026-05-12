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
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      await client.query('UPDATE service_requests SET device_id = NULL WHERE device_id = $1', [id]);
      await client.query('UPDATE maintenance_plans SET device_id = NULL WHERE device_id = $1', [id]);
      const { rowCount } = await client.query('DELETE FROM devices WHERE id = $1', [id]);
      if (!rowCount) {
        throw ApiError.notFound('Device not found');
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      throw err;
    } finally {
      client.release();
    }
  }
}

export const equipmentService = new EquipmentService();