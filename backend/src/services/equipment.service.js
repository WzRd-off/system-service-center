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
      `SELECT sr.*, wr.diagnostic_result, wr.work_description, wr.used_parts
       FROM service_requests sr
       LEFT JOIN work_reports wr ON wr.request_id = sr.id
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
}

export const equipmentService = new EquipmentService();